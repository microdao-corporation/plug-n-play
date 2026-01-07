// src/adapters/ic/IIAdapter.ts

import { type ActorSubclass, Identity, HttpAgent } from "@icp-sdk/core/agent";
import { AuthClient } from "@dfinity/auth-client";
// Note: AuthClientTransport is not needed as we'll use AuthClient directly
import { type Wallet, Adapter } from "../../types/index.d";
import { BaseAdapter } from "../BaseAdapter";
import { createAccountFromPrincipal } from "../../utils";
import { getScreenDimensions } from "../../utils/browser";
import { IIAdapterConfig } from '../../types/AdapterConfigs';
import { isIIAdapterConfig } from '../../types/AdapterConfigs';

// Extend BaseIcAdapter
export class IIAdapter extends BaseAdapter<IIAdapterConfig> implements Adapter.Interface {
  // II specific properties
  private authClient: AuthClient | null = null;
  private agent: HttpAgent | null = null;

  constructor(args: { adapter: any; config: IIAdapterConfig } | IIAdapterConfig) {
    // Support simplified constructor in tests: new IIAdapter(config)
    const normalized = ((): { adapter: any; config: IIAdapterConfig } => {
      if ('config' in (args as any)) {
        return args as { adapter: any; config: IIAdapterConfig };
      }
      return {
        adapter: {
          id: 'ii',
          enabled: true,
          walletName: 'Internet Identity',
          logo: undefined,
          website: 'https://internetcomputer.org',
          chain: 'ICP',
          adapter: IIAdapter,
          config: {}
        },
        config: args as IIAdapterConfig,
      };
    })();

    if (!isIIAdapterConfig(normalized.config)) {
      throw new Error('Invalid config for IIAdapter');
    }
    super(normalized as any);
    
    // Initialize AuthClient immediately for Safari compatibility
    // This happens during app initialization, not during user interaction
    this.initializeAuthClientSync();
  }

  private initializeAuthClientSync(): void {
    // Initialize AuthClient with transport for better session management
    AuthClient.create({
      idleOptions: {
        idleTimeout: Number(
          this.config.delegationTimeout ?? 1000 * 60 * 60 * 24
        ), // Default 24 hours
        disableDefaultIdleCallback: true,
      },
    })
      .then(async (client) => {
        this.authClient = client;
        this.authClient.idleManager?.registerCallback?.(() =>
          this.refreshLogin()
        );
      })
      .catch((err) => {
        this.handleError("Failed to create AuthClient", err);
        this.setState(Adapter.Status.ERROR);
      });
  }

  private async ensureAuthClient(): Promise<void> {
    if (this.authClient) {
      return;
    }
    
    // Wait for AuthClient to be initialized
    let attempts = 0;
    while (!this.authClient && attempts < 50) { // Max 5 seconds
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!this.authClient) {
      throw new Error('Failed to initialize AuthClient after 5 seconds');
    }
  }

  async openChannel(): Promise<void> {
    // No-op for II adapter - AuthClient is initialized in constructor
    // This method exists for compatibility with other adapters
    return Promise.resolve();
  }

  // Use the resolved config for agent initialization
  private async initAgent(identity: Identity): Promise<void> {
    const agent = await this.buildHttpAgent({ identity });
    this.agent = agent;
  }

  async connect(): Promise<Wallet.Account> {
    try {
      this.setState(Adapter.Status.CONNECTING);
      
      // Ensure AuthClient is ready
      await this.ensureAuthClient();
      
      // Check if already authenticated before opening popup
      const isAuthenticated = await this.authClient!.isAuthenticated();
      
      if (isAuthenticated) {
        const identity = this.authClient!.getIdentity();
        const principal = identity?.getPrincipal();
        
        if (identity && principal && !principal.isAnonymous()) {
          // AuthClient returns @dfinity Identity, cast to @icp-sdk Identity for compatibility
          const account = await this.createAccountFromIdentity(identity as unknown as Identity);
          this.setState(Adapter.Status.CONNECTED);
          return account;
        }
      }
      
      // Not authenticated or invalid session - open login popup
      return await this.performLogin();
    } catch (error) {
      this.setState(Adapter.Status.ERROR);
      throw error;
    }
  }

  private async performLogin(): Promise<Wallet.Account> {
    return new Promise<Wallet.Account>((resolve, reject) => {
      // Determine which II provider to use
      const identityProvider = this.config.iiProviderUrl || 'https://id.ai';
      
      // Log which provider is being used for debugging
      console.log(`[IIAdapter] Using Identity Provider: ${identityProvider}`);
      
      const loginOptions = {
        derivationOrigin: this.config.derivationOrigin,
        identityProvider,
        maxTimeToLive:
          this.config.delegationTimeout ??
          BigInt(1 * 24 * 60 * 60 * 1000 * 1000 * 1000), // Default 1 day
        windowOpenerFeatures: (() => {
          const screen = getScreenDimensions();
          return `width=500,height=600,left=${screen.width / 2 - 250},top=${
            screen.height / 2 - 300
          }`;
        })(),
        onSuccess: async () => {
          try {
            const identity = this.authClient!.getIdentity();
            // AuthClient returns @dfinity Identity, cast to @icp-sdk Identity for compatibility
            const account = await this.createAccountFromIdentity(identity as unknown as Identity);
            this.setState(Adapter.Status.CONNECTED);
            resolve(account);
          } catch (error) {
            this.setState(Adapter.Status.ERROR);
            reject(error);
          }
        },
        onError: (error?: string) => {
          this.handleError("Login error", error || "Unknown error");
          this.setState(Adapter.Status.ERROR);
          reject(
            new Error(`II Authentication failed: ${error || "Unknown error"}`)
          );
        },
      };
      
      this.authClient!.login(loginOptions);
    });
  }

  private async createAccountFromIdentity(identity: Identity): Promise<Wallet.Account> {
    if (!identity) {
      throw new Error("No identity available after login");
    }

    const principal = identity.getPrincipal();

    if (principal.isAnonymous()) {
      throw new Error(
        "Authentication failed: Anonymous principal returned. " +
        "This usually means the authentication was cancelled or failed."
      );
    }
    
    await this.initAgent(identity);
    
    const account = await createAccountFromPrincipal(principal);
    if (!account || !account.owner) {
      throw new Error("Failed to create valid account from principal");
    }
    
    return account;
  }

  async isConnected(): Promise<boolean> {
    return this.authClient ? await this.authClient.isAuthenticated() : false;
  }

  // Implementation for BaseIcAdapter actor caching
  protected createActorInternal<T>(
    canisterId: string, 
    idl: any,
    _options?: {
      requiresSigning?: boolean;
    }
  ): ActorSubclass<T> {
    if (!this.agent) {
      throw new Error("Agent not initialized. Connect first.");
    }

    return this.createActorWithAgent<T>(this.agent, canisterId, idl);
  }

  async getPrincipal(): Promise<string> {
    if (!this.authClient) throw new Error("Not connected");
    const identity = this.authClient.getIdentity();
    if (!identity) throw new Error("Identity not available");
    const principal = identity.getPrincipal();
    return principal.toText();
  }

  /**
   * Get the identity provider URL being used
   * @returns The identity provider URL (e.g., 'https://id.ai' for II 2.0 or 'https://identity.ic0.app' for II 1.0)
   */
  getIdentityProvider(): string {
    return this.config.iiProviderUrl || 'https://id.ai';
  }

  /**
   * Check if using the legacy II provider
   * @returns true if using the legacy provider (identity.ic0.app or icp0.io)
   */
  isLegacyProvider(): boolean {
    const provider = this.getIdentityProvider();
    return provider.includes('ic0.app') || provider.includes('icp0.io');
  }

  private async refreshLogin(): Promise<void> {
    try {
      await this.ensureAuthClient();
      await this.performLogin(); 
    } catch (error) {
      this.handleError('Failed to refresh login', error);
      await this.disconnect().catch(() => {}); 
    }
  }

  // Disconnect logic specific to II
  protected async disconnectInternal(): Promise<void> {
    if (this.authClient) { 
        await this.authClient.logout();
    } 
  }

  // Cleanup logic specific to II
  protected cleanupInternal(): void {
      this.authClient = null;
      this.agent = null;
  }

  /**
   * Dispose of II-specific resources
   * Ensures AuthClient and agent are properly cleaned up
   */
  protected async onDispose(): Promise<void> {
    // Ensure logout if still connected
    if (this.authClient) {
      try {
        await this.authClient.logout();
      } catch (error) {
        // Best effort - already disposing
      }
      this.authClient = null;
    }
    this.agent = null;
  }
}