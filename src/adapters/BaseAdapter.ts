// src/adapters/BaseAdapter.ts

import { Actor, HttpAgent, type ActorSubclass, type Identity } from "@icp-sdk/core/agent";
import { type Wallet, Adapter } from "../types/index.d";
import { AdapterSpecificConfig } from "../types/AdapterConfigs";
import {
  deriveAccountId,
  createActorCacheKey,
  createAccountFromPrincipal
} from "../utils";
import { ErrorManager, LogLevel } from "../managers/ErrorManager";
import { LRUCache } from "../utils/LRUCache";

/**
 * Type-safe constructor arguments for adapters
 */
export interface AdapterConstructorArgs<T extends AdapterSpecificConfig = AdapterSpecificConfig> {
  adapter: Adapter.Config;
  config: T;
  logger?: ErrorManager;
}

/**
 * Interface for disposable resources
 */
export interface Disposable {
  dispose(): Promise<void>;
}

/**
 * Abstract base class for adapters implementing Adapter.Interface
 */
export abstract class BaseAdapter<T extends AdapterSpecificConfig = AdapterSpecificConfig> implements Adapter.Interface, Disposable {
  static supportedChains: Adapter.Chain[] = [Adapter.Chain.ICP];
  protected state: Adapter.Status = Adapter.Status.INIT;
  protected config: T;
  protected adapter: Adapter.Config;
  protected actorCache: LRUCache<string, ActorSubclass<any>> = new LRUCache(20);
  protected logger: ErrorManager;
  private disposed = false;

  constructor(args: AdapterConstructorArgs<T>) {
    // Validate configuration before storing
    this.validateConfig(args.config);
    
    this.config = args.config; // Store global config
    this.adapter = args.adapter; // Store adapter-specific config
    this.logger = args.logger || new ErrorManager(LogLevel.INFO); // Use provided logger or create fallback
  }

  /**
   * Validate adapter configuration
   * Override this method to implement adapter-specific validation
   * @param config - The configuration to validate
   * @throws {Error} If configuration is invalid
   */
  protected validateConfig(config: T): void {
    // Default validation - subclasses should override for specific validation
    if (!config) {
      throw new Error('Configuration is required');
    }
  }

  // Common state management
  protected setState(newState: Adapter.Status): void {
    this.state = newState;
  }

  openChannel(): Promise<void> {
    return Promise.resolve();
  }

  getState(): Adapter.Status {
    return this.state;
  }

  // Standard implementation for getAccountId, can be overridden by subclasses if needed
  async getAccountId(): Promise<string> {
    const principal = await this.getPrincipal();
    if (!principal)
      throw new Error("Principal not available to derive account ID");
    
    return deriveAccountId(principal);
  }

  // Abstract methods to be implemented by subclasses
  /**
   * Check if the adapter is currently connected to a wallet
   * @returns Promise resolving to true if connected, false otherwise
   */
  abstract isConnected(): Promise<boolean>;
  
  /**
   * Connect to the wallet and authenticate the user
   * @returns Promise resolving to the connected wallet account
   * @throws {Error} If connection fails or user rejects authentication
   */
  abstract connect(): Promise<Wallet.Account>;
  
  /**
   * Get the principal of the currently connected wallet
   * @returns Promise resolving to the principal as a string
   * @throws {Error} If not connected or principal unavailable
   */
  abstract getPrincipal(): Promise<string>;

  async getAddresses(): Promise<Adapter.Addresses> {
    const principal = await this.getPrincipal();
    const account = await createAccountFromPrincipal(principal);
    
    return {
      icp: {
        owner: account.owner,
        subaccount: account.subaccount,
      },
    };
  }
  
  // Base implementation of createActor with caching
  createActor<T>(
    canisterId: string,
    idl: any,
    options?: { requiresSigning?: boolean }
  ): ActorSubclass<T> {
    const { requiresSigning = false } = options || {};
    
    // Use utility to create cache key
    const cacheKey = createActorCacheKey(
      this.adapter.walletName,
      canisterId,
      requiresSigning
    );

    // Check if we have a cached actor
    const cachedActor = this.actorCache.get(cacheKey);
    if (cachedActor) {
      return cachedActor;
    }

    // No cached actor, create a new one
    const actor = this.createActorInternal<T>(canisterId, idl, options);
    this.actorCache.set(cacheKey, actor);
    return actor;
  }

  /**
   * Create an actor instance for interacting with a canister (adapter-specific implementation)
   * @param canisterId - The canister ID to create an actor for
   * @param idl - The IDL factory for the canister interface
   * @param options - Optional configuration for actor creation
   * @returns Actor instance for the specified canister
   * @throws {Error} If actor creation fails or adapter not connected
   */
  protected abstract createActorInternal<T>(
    canisterId: string,
    idl: any,
    options?: { requiresSigning?: boolean }
  ): ActorSubclass<T>;

  /**
   * Standardized error handling method for consistent logging across all adapters
   */
  protected handleError(context: string, error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));
    this.logger.error(`[${this.adapter.walletName}] ${context}`, err);
  }

  // Base disconnect logic
  async disconnect(): Promise<void> {
    if (
      this.state === Adapter.Status.DISCONNECTING ||
      this.state === Adapter.Status.CONNECTING ||
      this.state === Adapter.Status.DISCONNECTED
    ) {
      return;
    }
    this.setState(Adapter.Status.DISCONNECTING);
    try {
      await this.disconnectInternal(); // Call subclass-specific logic
    } catch (error) {
      this.handleError('Error during disconnect', error);
    } finally {
      this.cleanupInternal(); // Allow subclasses for further cleanup
      this.setState(Adapter.Status.DISCONNECTED);
    }
  }

  /**
   * Perform adapter-specific disconnect logic
   * Override this method to implement custom disconnect behavior
   * Default implementation clears the actor cache
   */
  protected async disconnectInternal(): Promise<void> {
    /* No-op by default */
    this.actorCache.clear();
  }
  
  /**
   * Perform adapter-specific resource cleanup
   * Override this method to clean up resources after disconnect
   * Called after disconnectInternal() in the finally block
   */
  protected cleanupInternal(): void {
    /* No-op by default */
  }

  /**
   * Dispose of all resources and clean up the adapter
   * This method ensures proper cleanup and prevents memory leaks
   */
  async dispose(): Promise<void> {
    if (this.disposed) return;
    
    try {
      await this.disconnect();
    } catch (error) {
      this.handleError('Error during dispose disconnect', error);
    }
    
    this.actorCache.clear();
    this.disposed = true;
    
    // Allow subclasses to perform additional disposal
    await this.onDispose();
  }

  /**
   * Hook for subclasses to perform additional disposal logic
   * Override this method to clean up adapter-specific resources
   */
  protected async onDispose(): Promise<void> {
    /* No-op by default - subclasses can override */
  }

  // ----- Shared helpers for agents and actors -----
  protected async buildHttpAgent(options?: { identity?: Identity }): Promise<HttpAgent> {
    const { identity } = options || {};
    const agent = HttpAgent.createSync({
      host: (this.config as any).hostUrl,
      identity,
      verifyQuerySignatures: (this.config as any).verifyQuerySignatures,
    });
    if ((this.config as any).fetchRootKey) {
      try {
        await agent.fetchRootKey();
      } catch (error) {
        this.handleError('Failed to fetch root key', error);
      }
    }
    return agent;
  }

  protected createActorWithAgent<T>(agent: HttpAgent, canisterId: string, idl: any): ActorSubclass<T> {
    try {
      return Actor.createActor<T>(idl, { agent, canisterId });
    } catch (error) {
      this.handleError('Actor creation error', error);
      throw error;
    }
  }

  // Synchronous variant for contexts that require sync actor creation
  protected buildHttpAgentSync(options?: { identity?: Identity }): HttpAgent {
    const { identity } = options || {};
    const agent = HttpAgent.createSync({
      host: (this.config as any).hostUrl,
      identity,
      verifyQuerySignatures: (this.config as any).verifyQuerySignatures,
    });
    if ((this.config as any).fetchRootKey) {
      // Fire and forget to keep API synchronous
      agent.fetchRootKey().catch((error) => {
        this.handleError('Failed to fetch root key (sync)', error);
      });
    }
    return agent;
  }
}
