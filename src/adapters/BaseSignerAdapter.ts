import { Principal } from "@icp-sdk/core/principal";
import { Actor, HttpAgent, type ActorSubclass } from "@icp-sdk/core/agent";
import { SignerAgent } from "@slide-computer/signer-agent";
import { Signer } from "@slide-computer/signer";
import { BaseAdapter, AdapterConstructorArgs } from "./BaseAdapter";
import { AdapterSpecificConfig } from "../types/AdapterConfigs";
import { Adapter, Wallet } from "../types/index.d";
import { createAccountFromPrincipal } from "../utils";
import { withTimeout, DEFAULT_TIMEOUTS } from "../utils/timeout";
import { storage, windowEvents } from "../utils/browser";
import { getAccountSelector, cleanupAccountSelector } from "../ui/AccountSelector";

/**
 * Base class for adapters that use the Signer/SignerAgent pattern
 */
export abstract class BaseSignerAdapter<T extends AdapterSpecificConfig = AdapterSpecificConfig> extends BaseAdapter<T> {
  protected signer: Signer | null = null;
  protected agent: HttpAgent | SignerAgent<any> | null = null;
  protected signerAgent: SignerAgent<Signer> | null = null;
  protected transport: any = null;
  protected principalStorageKey: string;
  private connectionAbortController: AbortController | null = null;
  private windowFocusHandler: (() => void) | null = null;

  constructor(args: AdapterConstructorArgs<T>) {
    super(args);
    this.principalStorageKey = `${this.adapter.id}_principal`;
  }

  async openChannel(): Promise<void> {
    if (this.signer) {
      await this.signer.openChannel();
    }
  }

  async isConnected(): Promise<boolean> {
    return this.agent !== null && this.signer !== null && this.signerAgent !== null;
  }

  async getPrincipal(): Promise<string> {
    if (!this.signerAgent) {
      // Try to recreate signerAgent if missing
      if (this.transport && this.signer && this.adapter.config.hostUrl) {
        this.agent = HttpAgent.createSync({ host: this.adapter.config.hostUrl });
        this.signerAgent = SignerAgent.createSync({
          signer: this.signer,
          account: Principal.anonymous(),
          agent: this.agent,
        });
      } else {
        throw new Error(`${this.adapter.walletName} signer agent not initialized or connected`);
      }
    }
    const principal = await this.signerAgent.getPrincipal();
    return principal.toText();
  }

  protected async connectWithStoredPrincipal(): Promise<Principal | null> {
    const storedPrincipal = storage.getItem(this.principalStorageKey);

    if (storedPrincipal && storedPrincipal !== "null") {
      try {
        const principal = Principal.fromText(storedPrincipal);
        if (this.signerAgent) {
          this.signerAgent.replaceAccount(principal);
        }
        return principal;
      } catch (e) {
        storage.removeItem(this.principalStorageKey);
        // Fall through to normal connection flow
        return null;
      }
    }
    return null;
  }

  protected async connectWithAccounts(): Promise<Principal> {
    // Create an abort controller for this connection attempt
    this.connectionAbortController = new AbortController();

    // Track if we successfully got accounts
    let accountsReceived = false;
    let connectionComplete = false;

    // Set up window focus detection to cancel if user closes popup
    // But only if accounts haven't been received yet
    const focusPromise = new Promise<never>((_, reject) => {
      this.windowFocusHandler = () => {
        // Add a small delay to allow the connection to complete after popup closes
        setTimeout(() => {
          // Only reject if we haven't received accounts AND connection isn't complete
          // This prevents cancellation when the popup closes after successful approval
          if (!accountsReceived && !connectionComplete) {
            // Remove listener immediately to prevent multiple triggers
            windowEvents.removeEventListener('focus', this.windowFocusHandler!);
            this.windowFocusHandler = null;
            reject(new Error('Connection cancelled - popup window was closed'));
          }
        }, 500); // 500ms delay to allow connection to complete
      };
      windowEvents.addEventListener('focus', this.windowFocusHandler);
    });

    try {
      // Race between getting accounts, detecting window focus, and timeout
      const accounts = await withTimeout(
        Promise.race([
          this.signerAgent!.signer.accounts().then(result => {
            // Mark that we've successfully received accounts
            accountsReceived = true;
            return result;
          }),
          focusPromise
        ]),
        DEFAULT_TIMEOUTS.authTimeout!,
        `${this.adapter.walletName} connection timed out after ${DEFAULT_TIMEOUTS.authTimeout! / 1000}s`
      );

      if (!accounts || accounts.length === 0) {
        await this.disconnect();
        throw new Error(`No accounts returned from ${this.adapter.walletName}`);
      }

      // Handle account selection
      let selectedIndex = 0;

      // Check if account selection should be shown
      if (accounts.length > 1 && this.shouldShowAccountSelection()) {
        const selector = getAccountSelector();
        const selection = await selector.show({
          walletName: this.adapter.walletName,
          accounts: accounts,
          onSelect: (index) => {
            // Callback handled in promise
          },
          onCancel: () => {
            // Callback handled in promise
          }
        });

        if (selection === null) {
          // User cancelled
          await this.disconnect();
          throw new Error('Account selection cancelled');
        }

        selectedIndex = selection;
      }

      const principal = accounts[selectedIndex].owner;
      storage.setItem(this.principalStorageKey, principal.toText());
      // Also store the selected account index for future reference
      storage.setItem(`${this.principalStorageKey}_index`, selectedIndex.toString());

      if (this.signerAgent) {
        this.signerAgent.replaceAccount(principal);
      }
      // Mark connection as complete before returning
      connectionComplete = true;
      return principal;
    } finally {
      // Clean up the focus listener if it's still attached
      if (this.windowFocusHandler) {
        windowEvents.removeEventListener('focus', this.windowFocusHandler);
        this.windowFocusHandler = null;
      }
      this.connectionAbortController = null;
    }
  }

  /**
   * Determines whether to show account selection UI
   * Can be overridden by subclasses for wallet-specific behavior
   */
  protected shouldShowAccountSelection(): boolean {
    // Check if account selection is explicitly disabled in config
    if (this.config && 'disableAccountSelection' in this.config) {
      return !(this.config as any).disableAccountSelection;
    }
    // Default to showing selection for multiple accounts
    return true;
  }

  async connect(): Promise<Wallet.Account> {
    this.setState(Adapter.Status.CONNECTING);
    try {
      // Ensure transport is initialized
      await this.ensureTransportInitialized();

      if (!this.signerAgent || !this.signerAgent.signer) {
        throw new Error(`${this.adapter.walletName} signer agent not initialized. Please ensure extension is installed.`);
      }

      // Try to connect with stored principal first
      let principal = await this.connectWithStoredPrincipal();

      // If no stored principal or it failed, get accounts
      if (!principal) {
        principal = await this.connectWithAccounts();
      }

      if (principal.isAnonymous()) {
        this.setState(Adapter.Status.READY);
        throw new Error(
          `Failed to authenticate with ${this.adapter.walletName} - got anonymous principal`
        );
      }

      if (this.adapter.config.fetchRootKey) {
        if (!this.signerAgent) throw new Error("Signer agent not ready for fetchRootKey");
        await this.signerAgent.fetchRootKey();
      }

      this.setState(Adapter.Status.CONNECTED);
      return createAccountFromPrincipal(principal);
    } catch (error) {
      this.handleError('Connection error', error);
      await this.disconnect();
      throw error;
    }
  }

  protected createActorInternal<T>(
    canisterId: string,
    idlFactory: any,
    _options?: { requiresSigning?: boolean }
  ): ActorSubclass<T> {
    if (!this.signerAgent) {
      throw new Error(`No signer agent available. Please connect first.`);
    }
    try {
      return Actor.createActor<T>(idlFactory, {
        agent: this.signerAgent,
        canisterId,
      });
    } catch (error) {
      this.handleError('Actor creation error', error);
      throw error;
    }
  }

  protected async disconnectInternal(): Promise<void> {
    // Clean up any pending connection attempts
    if (this.windowFocusHandler) {
      windowEvents.removeEventListener('focus', this.windowFocusHandler);
      this.windowFocusHandler = null;
    }
    if (this.connectionAbortController) {
      this.connectionAbortController.abort();
      this.connectionAbortController = null;
    }

    if (this.signer) {
      try {
        await this.signer.closeChannel();
      } catch (error) {
        this.handleError('Error closing signer channel', error);
      }
    }
    // Clear stored principal on disconnect
    storage.removeItem(this.principalStorageKey);
  }

  protected cleanupInternal(): void {
    // Reset agents but keep transport and signer for faster reconnection
    this.agent = null;
    this.signerAgent = null;
  }

  /**
   * Ensure the transport layer is initialized for the signer
   * Subclasses must implement this to set up their specific transport mechanism
   * @throws {Error} If transport initialization fails
   */
  protected abstract ensureTransportInitialized(): Promise<void>;

  /**
   * Dispose of signer-specific resources
   * Cleans up signer, agents, and stored principal
   */
  protected async onDispose(): Promise<void> {
    // Clean up any pending connection attempts
    if (this.windowFocusHandler) {
      windowEvents.removeEventListener('focus', this.windowFocusHandler);
      this.windowFocusHandler = null;
    }
    if (this.connectionAbortController) {
      this.connectionAbortController.abort();
      this.connectionAbortController = null;
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

    // Clear stored principal and account index
    if (this.principalStorageKey) {
      storage.removeItem(this.principalStorageKey);
      storage.removeItem(`${this.principalStorageKey}_index`);
    }

    // Clean up account selector UI
    cleanupAccountSelector();
  }

  /**
   * Get current Signer instance
   */
  public getSigner(): Signer | null {
    return this.signer;
  }

  /**
 * Get current SignerAgent instance
 */
  public getSignerAgent(): SignerAgent<Signer> | null {
    return this.signerAgent;
  }
} 