import { PostMessageTransport } from "@slide-computer/signer-web";
import { BrowserExtensionTransport } from "@slide-computer/signer-extension";
import { StoicTransport } from "@slide-computer/signer-transport-stoic";
import { SignerAgent } from "@slide-computer/signer-agent";
import { Signer } from "@slide-computer/signer";
import { Principal } from "@dfinity/principal";
import { Actor, HttpAgent, type ActorSubclass } from "@dfinity/agent";
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
  COMPUTR = "computr",
}

// Shape of window.ic.computr as exposed by the Computr extension's inpage script.
interface ComputrProvider {
  principalId?: string;
  agent?: HttpAgent;
  isConnected(): Promise<boolean>;
  requestConnect(args?: { whitelist?: string[]; host?: string }): Promise<boolean>;
  disconnect(): Promise<void>;
  getPrincipal(opts?: { asString?: boolean }): Promise<Principal | string | null>;
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
  private plugSendMessage: ((msg: any) => Promise<any>) | null = null;
  // Used by the COMPUTR path only — the provider's own HttpAgent handles signing.
  private computrProviderAgent: HttpAgent | null = null;

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
    if (this.signerType === SignerType.COMPUTR) {
      // Computr doesn't use Signer/SignerAgent — handled entirely in connect().
      await this.initializeTransport();
      return;
    }

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

  // Waits for window.ic.computr to be available, falling back to the
  // computr:ready event fired after the inpage script's async setup.
  private waitForComputrProvider(timeoutMs = 3000): Promise<ComputrProvider> {
    if (window.ic?.computr) return Promise.resolve(window.ic.computr as ComputrProvider);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Computr wallet extension not found. Please install it first."));
      }, timeoutMs);
      window.addEventListener('computr:ready', () => {
        clearTimeout(timer);
        if (window.ic?.computr) {
          resolve(window.ic.computr as ComputrProvider);
        } else {
          reject(new Error("Computr provider unavailable after ready event."));
        }
      }, { once: true });
    });
  }

  protected async initializeTransport(): Promise<void> {
    if (this.signerType === SignerType.COMPUTR) {
      // No Signer/SignerAgent involved — the provider itself handles signing.
      // Just verify the extension is present; providerAgent is captured in connect().
      await this.waitForComputrProvider();
      return;
    } else if (this.signerType === SignerType.STOIC) {
      // Create Stoic transport
      const stoicTransport = await StoicTransport.create();
      // Connect the underlying connection first (required for Stoic)
      // Note: Stoic handles its own window management, so we don't add focus detection here
      await stoicTransport.connection.connect();
      this.transport = stoicTransport;
    } else if (this.signerType === SignerType.PLUG) {
      // Plug's UUID for ICRC-94 support
      const PLUG_UUID = "71edc834-bab2-4d59-8860-c36a01fee7b8";
      const providerDetails = await BrowserExtensionTransport.discover({ window });
      const providerDetail = providerDetails.find(({ uuid }) => uuid === PLUG_UUID);
      if (!providerDetail) {
        throw new Error("Plug wallet extension not found. Please install it.");
      }
      // Capture sendMessage so we can probe approval state without a popup later
      this.plugSendMessage = providerDetail.sendMessage ?? null;
      this.transport = new BrowserExtensionTransport({ providerDetail, window });
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
      await this.ensureTransportInitialized();

      // ── Computr path: window.ic.computr provider ──────────────────────────
      if (this.signerType === SignerType.COMPUTR) {
        const provider = await this.waitForComputrProvider();
        this.computrProviderAgent = provider.agent ?? null;

        // Fast path: restore stored principal without prompting the extension.
        const storedText = storage.getItem(this.principalStorageKey);
        if (storedText) {
          try {
            const principal = Principal.fromText(storedText);
            this.setState(Adapter.Status.CONNECTED);
            return createAccountFromPrincipal(principal);
          } catch {
            storage.removeItem(this.principalStorageKey);
          }
        }

        // Full flow: show extension approval popup.
        const approved = await provider.requestConnect({
          whitelist: (this.config as any).whitelist,
          host: (this.config as any).host,
        });
        if (!approved) {
          throw new Error("Computr connection rejected by user.");
        }

        // Resolve principal — synchronous field populated by requestConnect.
        let principalText: string | null = provider.principalId ?? null;
        if (!principalText) {
          principalText = (await provider.getPrincipal({ asString: true }) as string | null);
        }
        if (!principalText) {
          throw new Error("Computr did not return a principal. Is the extension configured with a principal?");
        }
        const principal = Principal.fromText(principalText);
        if (principal.isAnonymous()) {
          throw new Error("Computr returned anonymous principal — wallet may not be configured.");
        }

        storage.setItem(this.principalStorageKey, principalText);
        this.setState(Adapter.Status.CONNECTED);
        return createAccountFromPrincipal(principal);
      }

      // ── Signer-based path (OISY, NFID, Stoic, Plug) ──────────────────────
      if (!this.signerAgent || !this.signer) {
        throw new Error(`${this.adapter.walletName} signer agent not initialized. Please ensure extension is installed.`);
      }

      if (this.signerType === SignerType.STOIC) {
        await this.connectStoic();
      } else {
        await this.connectPostMessage();
      }

      // For PLUG, verify the origin is still approved before trusting localStorage.
      let principal = this.signerType === SignerType.PLUG
        ? await this.connectWithStoredPrincipalPlug()
        : await this.connectWithStoredPrincipal();

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

  // Variant of connectWithStoredPrincipal for the PLUG/Computr ICRC-94 path.
  // Silently checks whether the extension still has this origin approved before
  // trusting the stored principal. Returns null (triggering full connect flow)
  // if the domain was removed or the check cannot be performed.
  private async connectWithStoredPrincipalPlug(): Promise<Principal | null> {
    const storedPrincipal = storage.getItem(this.principalStorageKey);
    if (!storedPrincipal || storedPrincipal === 'null') return null;

    try {
      const principal = Principal.fromText(storedPrincipal);

      if (this.plugSendMessage) {
        // computr_isConnected checks approvedDomains without showing any popup
        const response = await this.plugSendMessage({
          id: Math.random().toString(36).slice(2),
          method: 'computr_isConnected',
          params: {},
        }) as any;

        if (!response?.result?.connected) {
          storage.removeItem(this.principalStorageKey);
          return null;
        }
      }

      if (this.signerAgent) {
        this.signerAgent.replaceAccount(principal);
      }
      return principal;
    } catch {
      storage.removeItem(this.principalStorageKey);
      return null;
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

  async isConnected(): Promise<boolean> {
    if (this.signerType === SignerType.COMPUTR) {
      try {
        const provider = await this.waitForComputrProvider();
        return await provider.isConnected();
      } catch {
        return false;
      }
    }
    return super.isConnected();
  }

  async getPrincipal(): Promise<string> {
    if (this.signerType === SignerType.COMPUTR) {
      const provider = await this.waitForComputrProvider();
      if (provider.principalId) return provider.principalId;
      const result = await provider.getPrincipal({ asString: true }) as string | null;
      if (!result) {
        throw new Error("Computr did not return a principal. Is the extension configured with a principal?");
      }
      return result;
    }
    return super.getPrincipal();
  }

  protected createActorInternal<T>(
    canisterId: string,
    idlFactory: any,
    _options?: { requiresSigning?: boolean }
  ): ActorSubclass<T> {
    if (this.signerType === SignerType.COMPUTR) {
      if (!this.computrProviderAgent) {
        throw new Error("Computr agent not available. Call connect() before creating actors.");
      }
      return Actor.createActor<T>(idlFactory, {
        agent: this.computrProviderAgent,
        canisterId,
        blsVerify: async () => true,
      });
    }
    return super.createActorInternal(canisterId, idlFactory, _options);
  }

  protected async disconnectInternal(): Promise<void> {
    if (this.signerType === SignerType.COMPUTR) {
      storage.removeItem(this.principalStorageKey);
      try {
        const provider = await this.waitForComputrProvider();
        await provider.disconnect();
      } catch (error) {
        this.handleError("Error during Computr disconnect", error);
      }
      return;
    }
    return super.disconnectInternal();
  }

  protected cleanupInternal(): void {
    this.plugSendMessage = null;
    this.computrProviderAgent = null;
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
        this.signer.closeChannel();
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