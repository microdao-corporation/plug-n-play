// src/adapters/ic/LedgerAdapter.ts

import { type ActorSubclass, type PublicKey, type Signature, HttpAgent, type Identity, type CallRequest, type ReadRequest, type HttpAgentRequest } from "@dfinity/agent";
import { Cbor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Secp256k1PublicKey } from "@dfinity/identity-secp256k1";
import { BaseAdapter, type AdapterConstructorArgs } from "../BaseAdapter";
import { Adapter, type Wallet } from "../../types/index.d";
import { LedgerAdapterConfig } from "../../types/AdapterConfigs";
import type InternetComputerApp from "@zondax/ledger-icp";
import type { Transport } from "@ledgerhq/hw-transport";
import { Buffer } from "buffer";
import { getWalletModal, type RequestType } from "../../ui/WalletModal";

// Import utilities
import { LEDGER_DEFAULTS, LEDGER_RETURN_CODE } from "../../utils/ledger/constants";
import { derToRaw } from "../../utils/ledger/crypto";
import { fetchConsentMessage } from "../../utils/ledger/icrc21";
import { loadTransport, loadLedgerApp } from "../../utils/ledger/modules";
import type { LedgerRequest, LedgerCallRequest } from "../../utils/ledger/types";
import { isCallRequest, isTransferRequest } from "../../utils/ledger/types";

/**
 * Default Ledger adapter settings
 */
export const LedgerAdapterDefaults = {
  derivePath: LEDGER_DEFAULTS.DERIVE_PATH,
  transport: LEDGER_DEFAULTS.TRANSPORT,
  transportTimeout: LEDGER_DEFAULTS.TRANSPORT_TIMEOUT,
};

/**
 * Custom Identity implementation for Ledger hardware wallet
 */
class LedgerIdentity implements Identity {
  constructor(
    private app: InternetComputerApp,
    private derivationPath: string,
    private publicKey: Secp256k1PublicKey
  ) {}

  getPublicKey(): PublicKey {
    return this.publicKey;
  }

  getPrincipal(): Principal {
    return Principal.selfAuthenticating(new Uint8Array(this.publicKey.toDer()));
  }


  /**
   * Create a read state request from a call request
   */
  private createReadStateRequest(callRequest: LedgerCallRequest): ReadRequest {
    return {
      request_type: 'read_state',
      paths: [
        [new TextEncoder().encode('request_status'), callRequest.request_id!]
      ],
      ingress_expiry: callRequest.ingress_expiry,
      sender: callRequest.sender
    } as ReadRequest;
  }


  /**
   * Determine the request type for modal display
   */
  private getRequestType(request: LedgerRequest): RequestType {
    if (isCallRequest(request)) {
      if (isTransferRequest(request)) {
        return 'transfer';
      } else if (request.method_name === 'icrc2_approve') {
        return 'approve';
      } else {
        return 'call';
      }
    } else if (request.request_type === 'read_state') {
      return 'read';
    }
    return 'generic';
  }

  /**
   * Sign a request using signBls (for non-transfer calls with ICRC-21 support)
   */
  private async signWithBls(
    request: LedgerCallRequest,
    consentMessage: string | null
  ): Promise<Buffer> {
    // Encode the call request with content wrapper
    const callCbor = Cbor.encode({ content: request });
    const callMessage = Buffer.from(callCbor);

    // Create a read_state request for checking the call status
    const readStateRequest = this.createReadStateRequest(request);
    const readStateCbor = Cbor.encode({ content: readStateRequest });
    const readStateMessage = Buffer.from(readStateCbor);

    // Prepare parameters for signBls (all must be non-empty hex strings)
    const consentRequest = consentMessage
      ? Buffer.from(consentMessage, 'utf-8').toString('hex')
      : '00'; // Single zero byte when no consent message
    const canisterCall = callMessage.toString('hex');
    const certificate = readStateMessage.toString('hex');

    console.log('[LedgerIdentity] SignBls parameters:', {
      hasConsentMessage: !!consentMessage,
      consentLength: consentRequest.length,
      callLength: canisterCall.length,
      certificateLength: certificate.length
    });

    const blsResponse = await this.app.signBls(
      this.derivationPath,
      consentRequest,
      canisterCall,
      certificate
    );

    // Check for success
    if (blsResponse.returnCode !== LEDGER_RETURN_CODE.SUCCESS) {
      throw new Error(`Ledger signing failed: ${blsResponse.errorMessage}`);
    }

    if (!blsResponse.signatureRS) {
      throw new Error("No signature returned from Ledger device");
    }

    // signatureRS is already in raw RS format (64 bytes)
    return Buffer.from(blsResponse.signatureRS);
  }

  /**
   * Sign a request using regular sign method
   */
  private async signRegular(request: LedgerRequest): Promise<Buffer> {
    const cborRequest = Cbor.encode({ content: request });
    const message = Buffer.from(cborRequest);

    console.log('[LedgerIdentity] Signing CBOR request, length:', message.length);

    const signResponse = await this.app.sign(this.derivationPath, message, 0x00);

    if (signResponse.returnCode !== LEDGER_RETURN_CODE.SUCCESS) {
      throw new Error(`Ledger signing failed: ${signResponse.errorMessage}`);
    }

    if (!signResponse.signatureDER) {
      throw new Error("No signature returned from Ledger device");
    }

    return derToRaw(signResponse.signatureDER);
  }

  /**
   * Sign a CBOR-encoded request for the Ledger device
   */
  private async signCbor(request: LedgerRequest): Promise<Signature> {
    const requestType = this.getRequestType(request);

    // Show the modal
    const modal = getWalletModal();
    modal.show({
      type: 'signing',
      walletName: 'Ledger',
      requestType,
      steps: [
        'Check your Ledger device screen',
        'Review the transaction details carefully',
        'Press both buttons to confirm or right button to reject'
      ],
      warning: '⚠️ <strong>Do not close this window</strong> while confirming on your Ledger device',
      showSpinner: true
    });

    try {
      console.log('[LedgerIdentity] Request details:', {
        request_type: request.request_type,
        method_name: isCallRequest(request) ? request.method_name : undefined,
        canister_id: isCallRequest(request) ? request.canister_id?.toString() : undefined
      });

      // Determine signing strategy
      let rawSignature: Buffer;

      if (isCallRequest(request) && !isTransferRequest(request)) {
        // For non-transfer calls, use signBls with ICRC-21 support
        console.log('[LedgerIdentity] Using signBls for non-transfer call');

        // Attempt to fetch ICRC-21 consent message
        let consentMessage: string | null = null;
        if (request.canister_id && request.method_name && request.arg) {
          consentMessage = await fetchConsentMessage(
            request.canister_id.toString(),
            request.method_name,
            request.arg
          );
        }

        rawSignature = await this.signWithBls(request, consentMessage);
      } else {
        // For transfers and read state requests, use regular sign
        console.log('[LedgerIdentity] Using regular sign for', request.request_type);
        rawSignature = await this.signRegular(request);
      }

      modal.destroy();
      console.log('[LedgerIdentity] Signature completed, length:', rawSignature.length);

      return rawSignature as unknown as Signature;
    } catch (error) {
      modal.destroy();
      throw error;
    }
  }

  async transformRequest(request: HttpAgentRequest): Promise<unknown> {
    const { body, ...rest } = request;

    // Log the request type for debugging
    console.log('[LedgerIdentity] Transform request for endpoint:', rest.endpoint);
    const typedBody = body as LedgerRequest;
    console.log('[LedgerIdentity] Request body type:', body ? typedBody.request_type : 'unknown');

    // Get the public key DER for the sender
    const sender_pubkey = this.publicKey.toDer();

    // Sign the CBOR-encoded request body
    const sender_sig = await this.signCbor(typedBody);

    return {
      ...rest,
      body: {
        content: body,
        sender_pubkey,
        sender_sig,
      },
    };
  }

  async sign(_blob: ArrayBuffer): Promise<Signature> {
    // This method is not used when implementing transformRequest directly
    throw new Error("sign() should not be called when transformRequest is implemented");
  }
}

/**
 * Ledger hardware wallet adapter for Internet Computer
 */
export class LedgerAdapter extends BaseAdapter<LedgerAdapterConfig> {
  static supportedChains: Adapter.Chain[] = [Adapter.Chain.ICP];

  private transport: Transport | null = null;
  private app: InternetComputerApp | null = null;
  private identity: LedgerIdentity | null = null;
  private agent: HttpAgent | null = null;
  private derivationPath: string;
  private principal: string | null = null;
  private transportTimeout: number;

  constructor(args: AdapterConstructorArgs<LedgerAdapterConfig>) {
    super(args);

    // Apply defaults
    this.config = {
      ...LedgerAdapterDefaults,
      ...this.config
    };

    this.derivationPath = this.config.derivePath || LedgerAdapterDefaults.derivePath;
    this.transportTimeout = LedgerAdapterDefaults.transportTimeout;
  }

  protected validateConfig(config: LedgerAdapterConfig): void {
    super.validateConfig(config);

    if (config.derivePath) {
      // Validate derivation path format
      const pathRegex = /^m(\/\d+'?)+$/;
      if (!pathRegex.test(config.derivePath)) {
        throw new Error('Invalid derivation path format');
      }
    }
  }

  async isConnected(): Promise<boolean> {
    return this.transport !== null && this.app !== null && this.identity !== null;
  }

  async openChannel(): Promise<void> {
    // Pre-initialize transport for Safari compatibility
    if (typeof window === 'undefined') {
      throw new Error("Ledger adapter requires a browser environment");
    }

    // This method can be used to pre-load the transport library
    // to avoid popup blocking issues in Safari
    this.logger.info("[LedgerAdapter] Pre-loading transport library");
  }

  /**
   * Initialize Ledger transport and app
   */
  private async initializeLedgerDevice(): Promise<void> {
    this.logger.info("[LedgerAdapter] Requesting device permission");
    this.transport = await loadTransport(
      this.config.transport as 'WebHID' | 'WebUSB',
      this.transportTimeout
    );

    this.app = await loadLedgerApp(this.transport);

    // Verify IC app is open
    const version = await this.app.getVersion();
    if (version.returnCode !== LEDGER_RETURN_CODE.SUCCESS) {
      throw new Error("Please open the Internet Computer app on your Ledger device");
    }

    this.logger.info(`[LedgerAdapter] Connected to Ledger device - App version: ${version.major}.${version.minor}.${version.patch}`);
  }

  /**
   * Get address and public key from Ledger with user confirmation
   */
  private async getAddressWithConfirmation(): Promise<{
    principal: string;
    publicKey: Secp256k1PublicKey;
  }> {
    const modal = getWalletModal();
    modal.show({
      type: 'connecting',
      walletName: 'Ledger',
      subtitle: 'Please verify your address on the Ledger device',
      steps: [
        'Check your Ledger device screen',
        'Verify the principal address displayed',
        'Press both buttons to confirm'
      ],
      showSpinner: true
    });

    try {
      const addressResponse = await this.app!.showAddressAndPubKey(this.derivationPath);

      if (addressResponse.returnCode !== LEDGER_RETURN_CODE.SUCCESS) {
        throw new Error(`Failed to get address from Ledger: ${addressResponse.errorMessage}`);
      }

      if (!addressResponse.principal || !addressResponse.publicKey) {
        throw new Error("No principal or public key returned from Ledger device");
      }

      // Convert principal buffer to Principal object
      const principal = Principal.fromUint8Array(new Uint8Array(addressResponse.principal));
      const principalText = principal.toText();

      // Create a Secp256k1PublicKey from the Ledger's raw public key
      const publicKeyArrayBuffer = addressResponse.publicKey.buffer.slice(
        addressResponse.publicKey.byteOffset,
        addressResponse.publicKey.byteOffset + addressResponse.publicKey.byteLength
      ) as ArrayBuffer;
      const publicKey = Secp256k1PublicKey.fromRaw(publicKeyArrayBuffer);

      this.logger.info(`[LedgerAdapter] Principal: ${principalText}`);

      return { principal: principalText, publicKey };
    } finally {
      modal.destroy();
    }
  }

  /**
   * Clean up resources on error or disconnect
   */
  private async cleanup(): Promise<void> {
    if (this.transport) {
      try {
        await this.transport.close();
      } catch (error) {
        this.logger.error('[LedgerAdapter] Error closing transport:', error);
      }
      this.transport = null;
    }
    this.app = null;
    this.identity = null;
    this.agent = null;
    this.principal = null;
    this.actorCache.clear();
  }

  async connect(): Promise<Wallet.Account> {
    if (this.state === Adapter.Status.CONNECTING || this.state === Adapter.Status.CONNECTED) {
      return this.createAccount();
    }

    this.setState(Adapter.Status.CONNECTING);

    try {
      // Initialize device and app
      await this.initializeLedgerDevice();

      // Get address with user confirmation
      const { principal, publicKey } = await this.getAddressWithConfirmation();
      this.principal = principal;

      // Create the Ledger identity
      this.identity = new LedgerIdentity(
        this.app!,
        this.derivationPath,
        publicKey
      );

      // Initialize the agent with the Ledger identity
      await this.initAgent();

      this.setState(Adapter.Status.CONNECTED);
      return this.createAccount();

    } catch (error) {
      this.setState(Adapter.Status.ERROR);
      this.handleError('Connection failed', error);
      await this.cleanup();
      throw error;
    }
  }

  private async initAgent(): Promise<void> {
    if (!this.identity) {
      throw new Error("Identity not initialized");
    }

    this.agent = await this.buildHttpAgent({ identity: this.identity });
  }

  private createAccount(): Wallet.Account {
    if (!this.principal) {
      throw new Error("Principal not available");
    }

    return {
      owner: this.principal,
      subaccount: null,
    };
  }

  async getPrincipal(): Promise<string> {
    if (!this.principal) {
      throw new Error("Not connected to Ledger device");
    }
    return this.principal;
  }

  protected createActorInternal<T>(
    canisterId: string,
    idl: any,
    _options?: { requiresSigning?: boolean }
  ): ActorSubclass<T> {
    if (!this.agent) {
      throw new Error("Agent not initialized. Please connect first.");
    }

    return this.createActorWithAgent<T>(this.agent, canisterId, idl);
  }

  protected async disconnectInternal(): Promise<void> {
    await this.cleanup();
  }

  protected cleanupInternal(): void {
    // Additional cleanup if needed
  }

  protected async onDispose(): Promise<void> {
    await this.cleanup();
  }

  /**
   * Show address on Ledger device for verification
   */
  async showAddressOnDevice(): Promise<void> {
    if (!this.app) {
      throw new Error("Not connected to Ledger device");
    }

    const response = await this.app.showAddressAndPubKey(this.derivationPath);

    if (response.returnCode !== LEDGER_RETURN_CODE.SUCCESS) {
      throw new Error(`Failed to show address on device: ${response.errorMessage}`);
    }
  }

  /**
   * Sign a message for ICP transactions that require special handling
   * @param message - The message to sign
   * @param txType - The transaction type (0x00 for default, 0x01 for stake)
   */
  async signTransaction(message: Buffer, txType: number = 0x00): Promise<Buffer> {
    if (!this.app) {
      throw new Error("Not connected to Ledger device");
    }

    const response = await this.app.sign(this.derivationPath, message, txType);

    if (response.returnCode !== LEDGER_RETURN_CODE.SUCCESS) {
      throw new Error(`Signing failed: ${response.errorMessage}`);
    }

    if (!response.signatureDER) {
      throw new Error("No signature returned from device");
    }

    return response.signatureDER;
  }

  /**
   * Get the current transport type being used
   */
  getTransportType(): string {
    return this.config.transport || 'WebHID';
  }

  /**
   * Get the derivation path being used
   */
  getDerivationPath(): string {
    return this.derivationPath;
  }
}