// src/adapters/ic/LedgerAdapter.ts

import { type ActorSubclass, type PublicKey, type Signature, HttpAgent, type Identity, type CallRequest, type ReadRequest, type HttpAgentRequest } from "@dfinity/agent";
import { Cbor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Secp256k1PublicKey } from "@dfinity/identity-secp256k1";
import { BaseAdapter, type AdapterConstructorArgs } from "../BaseAdapter";
import { Adapter, type Wallet } from "../../types/index.d";
import { LedgerAdapterConfig } from "../../types/AdapterConfigs";
import type InternetComputerApp from "@zondax/ledger-icp";
import type Transport from "@ledgerhq/hw-transport";
import { Buffer } from "buffer";
import { getWalletModal, type RequestType } from "../../ui/WalletModal";

// Import utilities
import { LEDGER_DEFAULTS, LEDGER_RETURN_CODE } from "../../utils/ledger/constants";
import { derToRaw } from "../../utils/ledger/crypto";
import { fetchConsentMessageForLedger } from "../../utils/ledger/icrc21";
import { loadTransport, loadLedgerApp } from "../../utils/ledger/modules";
import type { LedgerRequest, LedgerCallRequest } from "../../utils/ledger/types";
import { isCallRequest, isReadRequest, isTransferRequest } from "../../utils/ledger/types";

/**
 * Default Ledger adapter settings
 */
export const LedgerAdapterDefaults = {
  derivePath: LEDGER_DEFAULTS.DERIVE_PATH,
  transport: LEDGER_DEFAULTS.TRANSPORT,
  transportTimeout: LEDGER_DEFAULTS.TRANSPORT_TIMEOUT,
};

/**
 * Connection state for Ledger adapter
 */
interface LedgerConnectionState {
  transport: Transport | null;
  app: InternetComputerApp | null;
  identity: LedgerIdentity | null;
  agent: HttpAgent | null;
  principal: string | null;
}

/**
 * Custom Identity implementation for Ledger hardware wallet
 */
class LedgerIdentity implements Identity {
  private readonly publicKeyDer: Uint8Array;
  private readonly principal: Principal;
  private readonly isDebugMode = typeof process !== 'undefined' && process.env.DEBUG === 'true';

  constructor(
    private readonly app: InternetComputerApp,
    private readonly derivationPath: string,
    private readonly publicKey: Secp256k1PublicKey
  ) {
    // Pre-compute frequently used values
    this.publicKeyDer = new Uint8Array(this.publicKey.toDer());
    this.principal = Principal.selfAuthenticating(this.publicKeyDer);
  }

  getPublicKey(): PublicKey {
    return this.publicKey;
  }

  getPrincipal(): Principal {
    return this.principal;
  }


  /**
   * Fetch consent data with timeout for parallel processing
   */
  private async fetchConsentWithTimeout(
    canisterId: string,
    method: string,
    arg: ArrayBuffer
  ): Promise<{ consentRequest: string; certificate: string } | null> {
    try {
      return await Promise.race([
        fetchConsentMessageForLedger(canisterId, method, arg),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('ICRC-21 timeout')), 5000)
        )
      ]);
    } catch {
      return null;
    }
  }




  /**
   * Determine the request type for modal display
   */
  private getRequestType(request: LedgerRequest): RequestType {
    if (isCallRequest(request)) {
      return isTransferRequest(request) ? 'transfer' :
             request.method_name === 'icrc2_approve' ? 'approve' : 'call';
    }
    return isReadRequest(request) ? 'read' : 'generic';
  }

  /**
   * Sign a request using signBls (for non-transfer calls with ICRC-21 support)
   */
  private async signWithBls(
    request: LedgerCallRequest,
    consentData: { consentRequest: string; certificate: string } | null
  ): Promise<Buffer> {
    // Encode the call request with content wrapper (required for BLS signing)
    const callMessage = Buffer.from(Cbor.encode({ content: request }));
    const canisterCall = callMessage.toString('hex');
    const consentRequest = consentData?.consentRequest || '00';
    const certificate = consentData?.certificate || '00';

    if (this.isDebugMode) {
      console.log('[LedgerIdentity] SignBls params:', {
        hasConsent: !!consentData,
        callLen: canisterCall.length
      });
    }

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
    const message = Buffer.from(Cbor.encode({ content: request }));

    if (this.isDebugMode) {
      console.log('[LedgerIdentity] CBOR request length:', message.length);
    }

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
    const isCall = isCallRequest(request);
    const shouldFetchConsent = isCall && !isTransferRequest(request) &&
                                request.canister_id && request.method_name && request.arg;

    // Start consent fetch in parallel for non-transfer calls
    const consentPromise = shouldFetchConsent
      ? this.fetchConsentWithTimeout(
          request.canister_id!.toString(),
          request.method_name!,
          request.arg!
        )
      : null;

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
      // Determine signing strategy
      let rawSignature: Buffer;

      if (isCallRequest(request) && !isTransferRequest(request)) {
        // For non-transfer calls, use signBls with ICRC-21 support
        const consentData = consentPromise ? await consentPromise : null;
        rawSignature = await this.signWithBls(request, consentData);
      } else {
        // For transfers and read state requests, use regular sign
        rawSignature = await this.signRegular(request);
      }

      modal.destroy();
      return rawSignature as unknown as Signature;
    } catch (error) {
      modal.destroy();
      throw error;
    }
  }

  async transformRequest(request: HttpAgentRequest): Promise<unknown> {
    const { body, ...rest } = request;
    const sender_sig = await this.signCbor(body as LedgerRequest);

    return {
      ...rest,
      body: {
        content: body,
        sender_pubkey: this.publicKeyDer,
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

  private connection: LedgerConnectionState = {
    transport: null,
    app: null,
    identity: null,
    agent: null,
    principal: null
  };
  private derivationPath: string;
  private transportTimeout: number;
  private readonly isDebugMode = typeof process !== 'undefined' && process.env.DEBUG === 'true';

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
    const { transport, app, identity } = this.connection;
    return !!(transport && app && identity);
  }

  async openChannel(): Promise<void> {
    // Pre-initialize transport for Safari compatibility
    if (typeof window === 'undefined') {
      throw new Error("Ledger adapter requires a browser environment");
    }

    // Pre-loads transport library to avoid Safari popup blocking
    if (this.isDebugMode) {
      this.logger.info("[LedgerAdapter] Pre-loading transport library");
    }
  }

  /**
   * Initialize Ledger transport and app
   */
  private async initializeLedgerDevice(): Promise<void> {
    const transport = await loadTransport(
      this.config.transport as 'WebHID' | 'WebUSB',
      this.transportTimeout
    );

    const app = await loadLedgerApp(transport);
    const version = await app.getVersion();

    if (version.returnCode !== LEDGER_RETURN_CODE.SUCCESS) {
      await transport.close();
      throw new Error("Please open the Internet Computer app on your Ledger device");
    }

    this.connection.transport = transport;
    this.connection.app = app;

    if (this.isDebugMode) {
      this.logger.info(`[LedgerAdapter] Connected: v${version.major}.${version.minor}.${version.patch}`);
    }
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
        'Scroll to confirm'
      ],
      showSpinner: true
    });

    try {
      const addressResponse = await this.connection.app!.showAddressAndPubKey(this.derivationPath);

      if (addressResponse.returnCode !== LEDGER_RETURN_CODE.SUCCESS) {
        throw new Error(`Failed to get address from Ledger: ${addressResponse.errorMessage}`);
      }

      if (!addressResponse.principal || !addressResponse.publicKey) {
        throw new Error("No principal or public key returned from Ledger device");
      }

      const principalText = Principal.fromUint8Array(
        new Uint8Array(addressResponse.principal)
      ).toText();

      const publicKey = Secp256k1PublicKey.fromRaw(
        addressResponse.publicKey.buffer.slice(
          addressResponse.publicKey.byteOffset,
          addressResponse.publicKey.byteOffset + addressResponse.publicKey.byteLength
        ) as ArrayBuffer
      );

      return { principal: principalText, publicKey };
    } finally {
      modal.destroy();
    }
  }

  /**
   * Clean up resources on error or disconnect
   */
  private async cleanup(): Promise<void> {
    const { transport } = this.connection;

    if (transport) {
      try {
        await transport.close();
      } catch {}
    }

    this.connection = {
      transport: null,
      app: null,
      identity: null,
      agent: null,
      principal: null
    };

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

      // Create the Ledger identity and initialize agent
      this.connection.principal = principal;
      this.connection.identity = new LedgerIdentity(
        this.connection.app!,
        this.derivationPath,
        publicKey
      );

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
    if (!this.connection.identity) {
      throw new Error("Identity not initialized");
    }

    this.connection.agent = await this.buildHttpAgent({ identity: this.connection.identity });
  }

  private createAccount(): Wallet.Account {
    if (!this.connection.principal) {
      throw new Error("Principal not available");
    }

    return {
      owner: this.connection.principal,
      subaccount: null,
    };
  }

  async getPrincipal(): Promise<string> {
    if (!this.connection.principal) {
      throw new Error("Not connected to Ledger device");
    }
    return this.connection.principal;
  }

  protected createActorInternal<T>(
    canisterId: string,
    idl: any,
    _options?: { requiresSigning?: boolean }
  ): ActorSubclass<T> {
    if (!this.connection.agent) {
      throw new Error("Agent not initialized. Please connect first.");
    }

    return this.createActorWithAgent<T>(this.connection.agent, canisterId, idl);
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
   * Public API method documented in demo
   */
  async showAddressOnDevice(): Promise<void> {
    if (!this.connection.app) {
      throw new Error("Not connected to Ledger device");
    }

    const response = await this.connection.app.showAddressAndPubKey(this.derivationPath);

    if (response.returnCode !== LEDGER_RETURN_CODE.SUCCESS) {
      throw new Error(`Failed to show address on device: ${response.errorMessage}`);
    }
  }
}