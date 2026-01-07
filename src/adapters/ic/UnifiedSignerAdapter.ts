import { PostMessageTransport } from "@slide-computer/signer-web";
import { BrowserExtensionTransport } from "@slide-computer/signer-extension";
import { StoicTransport } from "@slide-computer/signer-transport-stoic";
import { SignerAgent } from "@slide-computer/signer-agent";
import { Signer } from "@slide-computer/signer";
import { Principal } from "@icp-sdk/core/principal";
import { HttpAgent } from "@icp-sdk/core/agent";
import { BaseSignerAdapter } from "../BaseSignerAdapter";
import { AdapterConstructorArgs } from "../BaseAdapter";
import { Adapter, Wallet } from "../../types/index.d";
import { createAccountFromPrincipal } from "../../utils";
import { storage } from "../../utils/browser";

export enum SignerType {
  OISY = "oisy",
  NFID = "nfid",
  STOIC = "stoic",
  PLUG = "plug",
}

export interface UnifiedSignerConfig {
  signerType: SignerType;
  signerUrl?: string;
  windowOpenerFeatures?: string;
  establishTimeout?: number;
  disconnectTimeout?: number;
  statusPollingRate?: number;
  detectNonClickEstablishment?: boolean;
  maxTimeToLive?: bigint;
  keyType?: 'ECDSA' | 'Ed25519';
  hostUrl?: string;
  fetchRootKey?: boolean;
  verifyQuerySignatures?: boolean;
  disableAccountSelection?: boolean; // New: Option to disable account selection UI
  [key: string]: any;
}

/**
 * Unified adapter for all Signer-based wallets (OISY, NFID, Stoic)
 * Reduces code duplication by ~200 lines
 */
export class UnifiedSignerAdapter extends BaseSignerAdapter<UnifiedSignerConfig> {
  private signerType: SignerType;
  protected transport: PostMessageTransport | StoicTransport | BrowserExtensionTransport | null = null;

  constructor(args: AdapterConstructorArgs<UnifiedSignerConfig>) {
    super(args);
    this.signerType = this.config.signerType || this.detectSignerType();
    this.principalStorageKey = `${this.signerType}_principal`;
  }

  private detectSignerType(): SignerType {
    // Try to detect from adapter name or config
    const name = this.adapter.walletName?.toLowerCase();
    if (name?.includes('oisy')) return SignerType.OISY;
    if (name?.includes('nfid')) return SignerType.NFID;
    if (name?.includes('stoic')) return SignerType.STOIC;
    
    // Default based on URL patterns
    if (this.config.signerUrl?.includes('oisy')) return SignerType.OISY;
    if (this.config.signerUrl?.includes('nfid')) return SignerType.NFID;
    
    return SignerType.STOIC; // Default fallback
  }

  protected async ensureTransportInitialized(): Promise<void> {
    if (!this.transport) {
      await this.initializeTransport();
    }
    
    // Initialize signer and agents if not already done
    if (!this.signer && this.transport) {
      this.signer = new Signer({
        transport: this.transport
      });
      
      this.agent = HttpAgent.createSync({ 
        host: this.config.hostUrl,
        verifyQuerySignatures: this.config.verifyQuerySignatures 
      });
      
      this.signerAgent = SignerAgent.createSync({
        signer: this.signer,
        account: Principal.anonymous(),
        agent: this.agent,
      });
    }
  }

  protected async initializeTransport(): Promise<void> {
    if (this.signerType === SignerType.STOIC) {
      // Create Stoic transport
      const stoicTransport = await StoicTransport.create();
      // Connect the underlying connection first (required for Stoic)
      // Note: Stoic handles its own window management, so we don't add focus detection here
      await stoicTransport.connection.connect();
      this.transport = stoicTransport;
    } else if (this.signerType === SignerType.PLUG) {
      // Plug's UUID for ICRC-94 support
      const PLUG_UUID = "71edc834-bab2-4d59-8860-c36a01fee7b8";
      this.transport = await BrowserExtensionTransport.findTransport({
        uuid: PLUG_UUID,
        window: window,
      });
    } else {
      const url = this.config.signerUrl || (
        this.signerType === SignerType.OISY ? "https://oisy.com/sign" : "https://nfid.one/rpc"
      );
      
      const config = {
        url,
        windowOpenerFeatures: this.config.windowOpenerFeatures || "width=525,height=705",
        establishTimeout: this.config.establishTimeout || 10000,  // Reduced from 45s to 10s
        disconnectTimeout: this.config.disconnectTimeout || 10000,  // Reduced from 45s to 10s
        statusPollingRate: this.config.statusPollingRate || 500,
        detectNonClickEstablishment: this.config.detectNonClickEstablishment || false,
      };
      
      this.transport = new PostMessageTransport(config);
    }
  }

  async connect(): Promise<Wallet.Account> {
    this.setState(Adapter.Status.CONNECTING);
    try {
      // Ensure transport is initialized
      await this.ensureTransportInitialized();
      
      if (!this.signerAgent || !this.signer) {
        throw new Error(`${this.adapter.walletName} signer agent not initialized. Please ensure extension is installed.`);
      }

      // Perform wallet-specific connection logic
      if (this.signerType === SignerType.STOIC) {
        await this.connectStoic();
      } else {
        await this.connectPostMessage();
      }
      
      // Try to connect with stored principal first
      let principal = await this.connectWithStoredPrincipal();
      
      // If no stored principal or it failed, get accounts
      if (!principal) {
        principal = await this.connectWithAccounts();
      }
      
      this.setState(Adapter.Status.CONNECTED);
      return await createAccountFromPrincipal(principal);
      
    } catch (error) {
      this.setState(Adapter.Status.ERROR);
      throw error;
    }
  }

  private async connectPostMessage(): Promise<void> {
    // For OISY and NFID, the signer handles the connection through accounts()
    // The transport setup is already done in initializeTransport
    // The actual connection happens when we call signer.accounts()
  }

  private async connectStoic(): Promise<void> {
    // For Stoic, the channel is already established in initializeTransport
    // No additional connection steps needed here
  }

  protected cleanupInternal(): void {
    super.cleanupInternal();
    this.transport = null;
  }

  /**
   * Override to enable account selection for Plug wallet by default
   * Can be disabled via config.disableAccountSelection
   */
  protected shouldShowAccountSelection(): boolean {
    // For Plug wallet, default to showing account selection
    // unless explicitly disabled in config
    if (this.signerType === SignerType.PLUG) {
      return !this.config.disableAccountSelection;
    }
    // For other wallets, use parent class behavior
    return super.shouldShowAccountSelection();
  }

  /**
   * Dispose of UnifiedSigner-specific resources
   * Cleans up transport and signer connections
   */
  protected async onDispose(): Promise<void> {
    // Clean up transport
    if (this.transport) {
      try {
        if ('disconnect' in this.transport && typeof this.transport.disconnect === 'function') {
          await this.transport.disconnect();
        } else if ('close' in this.transport && typeof this.transport.close === 'function') {
          await this.transport.close();
        }
      } catch (error) {
        // Best effort - already disposing
      }
      this.transport = null;
    }

    // Clean up signer
    if (this.signer) {
      try {
        await this.signer.closeChannel();
      } catch (error) {
        // Best effort - already disposing
      }
      this.signer = null;
    }

    // Clean up agents
    this.agent = null;
    this.signerAgent = null;
    
    // Clear stored principal
    storage.removeItem(this.principalStorageKey);
  }
}