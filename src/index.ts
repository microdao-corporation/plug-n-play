// Polyfill globals for SSR compatibility - must be first import
import './utils/globals';

import { ActorSubclass } from "@icp-sdk/core/agent";
import { ICRC2_IDL } from "./did/icrc2.idl.js";
import { Adapter, GlobalPnpConfig } from "./types/index.d";
import { AdapterConfig, GetActorOptions } from './types/AdapterTypes';
import { WalletAccount } from './types/WalletTypes';
import { createPNPConfig, CreatePnpArgs } from "./config";
import { ConnectionManager } from './managers/ConnectionManager';
import { ActorManager } from './managers/ActorManager';
import { ConfigManager } from './managers/ConfigManager';
import { ErrorManager, LogLevel } from './managers/ErrorManager';
import { StateManager, PnpState, StateResponse, StateTransition } from './managers/StateManager';
import { globalPerformanceMonitor } from './utils/PerformanceMonitor';

// Re-export config types and creation function for easier consumption
export { createPNPConfig, PnpState };
export type { GlobalPnpConfig, StateResponse, StateTransition };
export type { ActorSubclass, GetActorOptions};

/**
 * Main interface for the PNP (Plug N Play) wallet adapter.
 * @interface PnpInterface
 */
export interface PnpInterface {
  /** Global configuration object */
  config: GlobalPnpConfig;
  /** Currently active adapter configuration */
  adapter: AdapterConfig | null;
  /** Wallet provider instance */
  provider: any;
  /** Connected wallet account details */
  account: WalletAccount | null;
  /** Current connection status */
  status: any;
  /** 
   * Connect to a wallet
   * @param {string} [walletId] - Optional wallet ID to connect to
   * @returns {Promise<WalletAccount | null>} Connected account or null
   */
  connect: (walletId?: string) => Promise<WalletAccount | null>;
  /** 
   * Disconnect from current wallet
   * @returns {Promise<void>}
   */
  disconnect: () => Promise<void>;
  /** 
   * Get an actor for interacting with a canister
   * @template T - Actor interface type
   * @param {any} options - Actor creation options
   * @returns {ActorSubclass<T>} Actor instance
   */
  getActor: <T>(options: any) => ActorSubclass<T>;
  /** 
   * Get an ICRC actor for token operations
   * @template T - Actor interface type
   * @param {string} canisterId - Canister ID
   * @param {Object} [options] - Optional configuration
   * @returns {ActorSubclass<T>} ICRC actor instance
   */
  getIcrcActor: <T>(canisterId: string, options?: { anon?: boolean; requiresSigning?: boolean }) => ActorSubclass<T>;
  /** 
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => boolean;
  /** 
   * Get list of enabled wallet adapters
   * @returns {AdapterConfig[]} Array of enabled adapter configurations
   */
  getEnabledWallets: () => AdapterConfig[];
}

/**
 * Main PNP (Plug N Play) class for managing wallet connections on the Internet Computer.
 * Supports multiple wallet adapters including Internet Identity, Plug, NFID, and cross-chain wallets
 * through SIWS (Solana) and SIWE (Ethereum) extensions.
 * 
 * @class PNP
 * 
 * @example
 * ```typescript
 * // Create PNP instance with configuration
 * const pnp = createPNP({
 *   network: 'ic',
 *   adapters: {
 *     ii: { enabled: true },
 *     plug: { enabled: true }
 *   }
 * });
 * 
 * // Connect to a wallet
 * const account = await pnp.connect('ii');
 * 
 * // Get an actor for canister interaction
 * const actor = pnp.getActor({ canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai' });
 * ```
 */
export class PNP implements PnpInterface {
  private configManager: ConfigManager;
  private connectionManager: ConnectionManager;
  private actorManager: ActorManager;
  private errorManager: ErrorManager;
  private stateManager: StateManager;

  // Performance optimization: Cache enabled wallets to avoid recreating objects on every call
  private cachedEnabledWallets: AdapterConfig[] | null = null;

  // Static registry for adapters
  private static adapterRegistry: Record<string, AdapterConfig> = {};

  /**
   * Register a new adapter globally. Call before PNP instantiation to make available to all instances.
   * @param id - Adapter id (unique key)
   * @param config - Adapter configuration object
   * @example
   * ```typescript
   * PNP.registerAdapter('customWallet', {
   *   label: 'Custom Wallet',
   *   enabled: true,
   *   adapterClass: CustomWalletAdapter
   * });
   * ```
   */
  static registerAdapter(id: string, config: AdapterConfig) {
    PNP.adapterRegistry[id] = config;
  }

  /**
   * Unregister an adapter by id.
   * @param id - Adapter id to remove
   */
  static unregisterAdapter(id: string) {
    delete PNP.adapterRegistry[id];
  }

  /**
   * Get all registered adapters.
   * @returns Object containing all registered adapters
   */
  static getRegisteredAdapters(): Record<string, AdapterConfig> {
    return { ...PNP.adapterRegistry };
  }

  /**
   * Creates a new PNP instance.
   * @param config - Configuration object for PNP
   */
  constructor(config: GlobalPnpConfig = {}) {
    // Performance optimization: Single adapter merge operation
    // Merge registered adapters with config.adapters only once
    const mergedConfig = {
      ...config,
      adapters: {
        ...PNP.adapterRegistry,
        ...(config.adapters || {})
      }
    };

    this.errorManager = new ErrorManager(
      config.logLevel || LogLevel.INFO
    );
    this.stateManager = new StateManager(
      this.errorManager,
      {
        key: config.persistenceKey || 'pnp-state',
        storage: config.storage,
        maxHistorySize: config.maxStateHistorySize,
        autoRecover: config.autoRecoverState,
        validateOnLoad: config.validateStateOnLoad
      }
    );

    // ConfigManager handles validation, no need to re-merge or update
    this.configManager = new ConfigManager(mergedConfig);
    const finalConfig = this.configManager.getConfig();

    // Invalidate wallet cache when configuration changes
    this.configManager.setOnConfigChange(() => {
      this.invalidateWalletCache();
    });

    this.connectionManager = new ConnectionManager(finalConfig, this.errorManager);
    this.actorManager = new ActorManager(finalConfig, null);

    // Keep actorManager's provider in sync with connectionManager
    this.connectionManager.setOnConnected(async () => {
      try {
        await this.stateManager.transitionTo(PnpState.CONNECTED);
        this.actorManager.setProvider(this.connectionManager.provider);
      } catch (error) {
        this.errorManager.handleError(error as Error);
      }
    });

    this.connectionManager.setOnDisconnected(async () => {
      try {
        await this.stateManager.transitionTo(PnpState.DISCONNECTED);
        this.actorManager.setProvider(null);
        this.actorManager.clearCache();
      } catch (error) {
        this.errorManager.handleError(error as Error);
      }
    });

    // Initialize state
    this.stateManager.transitionTo(PnpState.INITIALIZED).catch(error => {
      this.errorManager.handleError(error);
    });
  }

  /**
   * Opens authentication channel for Safari compatibility.
   * Must be called before connect() in Safari to prevent popup blocking.
   * @returns Promise that resolves when channel is opened
   * @example
   * ```typescript
   * // Safari requires channel opening before user action completes
   * button.onclick = async () => {
   *   await pnp.openChannel(); // Initialize AuthClient early
   *   await pnp.connect('ii'); // Popup opens without blocking
   * };
   * ```
   */
  async openChannel(): Promise<void> {
      await this.connectionManager.openChannel();
  }

  /**
   * Get the current configuration object.
   * @returns {GlobalPnpConfig} Current configuration
   */
  get config() {
    return this.configManager.getConfig();
  }

  /**
   * Get the currently active adapter.
   * @returns {AdapterConfig | null} Active adapter or null if not connected
   */
  get adapter() {
    return this.connectionManager.adapter;
  }

  /**
   * Get the current wallet provider instance.
   * @returns {any} Provider instance or null
   */
  get provider() {
    return this.connectionManager.provider;
  }

  /**
   * Get the connected wallet account details.
   * @returns {WalletAccount | null} Account details or null if not connected
   */
  get account() {
    return this.connectionManager.account;
  }

  /**
   * Get the current connection status.
   * @returns {any} Connection status
   */
  get status() {
    return this.connectionManager.status;
  }

  /**
   * Connect to a wallet adapter.
   * @param walletId - Optional wallet adapter ID to connect to
   * @returns Connected account or null
   * @throws If connection fails
   * @example
   * ```typescript
   * // Connect to Internet Identity
   * const account = await pnp.connect('ii');
   * console.log('Connected:', account.principal);
   * ```
   */
  async connect(walletId?: string) {
    const timingKey = globalPerformanceMonitor.startTiming('connection', walletId);
    try {
      if (this.stateManager.getCurrentState() === PnpState.CONNECTED) {
        // Already connected, return current account or handle as appropriate
        this.errorManager.info("Already connected.");
        globalPerformanceMonitor.endTiming(timingKey, true);
        return this.account;
      }
      await this.stateManager.transitionTo(PnpState.CONNECTING);
      
      
      const account = await this.connectionManager.connect(walletId);
      this.actorManager.setProvider(this.connectionManager.provider);
      globalPerformanceMonitor.endTiming(timingKey, true);
      return account;
    } catch (error) {
      await this.stateManager.transitionTo(PnpState.ERROR, { error });
      this.errorManager.handleError(error as Error);
      globalPerformanceMonitor.endTiming(timingKey, false, String(error));
      throw error;
    }
  }

  /**
   * Disconnect from the current wallet.
   * @returns Promise that resolves when disconnected
   * @throws If disconnection fails
   */
  async disconnect() {
    try {
      await this.stateManager.transitionTo(PnpState.DISCONNECTING);
      await this.connectionManager.disconnect();
      this.actorManager.setProvider(null);
      this.actorManager.clearCache();
    } catch (error) {
      await this.stateManager.transitionTo(PnpState.ERROR, { error });
      this.errorManager.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Get an actor for interacting with a canister.
   * @template T - Actor interface type
   * @param {GetActorOptions} options - Actor creation options
   * @returns {ActorSubclass<T>} Actor instance
   * @example
   * ```typescript
   * const actor = pnp.getActor<MyCanisterInterface>({
   *   canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
   *   idl: MyCanisterIDL
   * });
   * ```
   */
  getActor<T>(options: GetActorOptions): ActorSubclass<T> {
    return this.actorManager.getActor<T>(options);
  }

  /**
   * Get an ICRC actor for token operations.
   * @template T - Actor interface type
   * @param {string} canisterId - Canister ID of the ICRC token
   * @param {Object} [options] - Optional configuration
   * @param {boolean} [options.anon=false] - Use anonymous actor
   * @param {boolean} [options.requiresSigning=false] - Require signing capability
   * @returns {ActorSubclass<T>} ICRC actor instance
   * @example
   * ```typescript
   * const tokenActor = pnp.getIcrcActor('ryjl3-tyaaa-aaaaa-aaaba-cai');
   * const balance = await tokenActor.icrc1_balance_of({ owner: principal, subaccount: [] });
   * ```
   */
  getIcrcActor<T>(canisterId: string, options?: { anon?: boolean; requiresSigning?: boolean }): ActorSubclass<T> {
    const anon = options?.anon ?? false;
    const requiresSigning = options?.requiresSigning ?? false;
    if (anon) {
      return this.actorManager.createAnonymousActor<T>(canisterId, ICRC2_IDL);
    }
    if (this.connectionManager.provider && (this.connectionManager.provider as any).icrcActor) {
      return (this.connectionManager.provider as any).icrcActor({ canisterId, anon: false, requiresSigning }) as ActorSubclass<T>;
    }
    return this.actorManager.getActor<T>({ canisterId, idl: ICRC2_IDL, anon: false, requiresSigning });
  }

  /**
   * Check if user is authenticated with a wallet.
   * @returns {boolean} True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return this.connectionManager.isAuthenticated();
  }

  /**
   * Get list of enabled wallet adapters.
   * Uses caching to avoid recreating objects on every call for better performance.
   * Cache is invalidated automatically when configuration changes.
   * @returns {AdapterConfig[]} Array of enabled adapter configurations
   * @example
   * ```typescript
   * const wallets = pnp.getEnabledWallets();
   * wallets.forEach(wallet => {
   *   console.log(`${wallet.label}: ${wallet.id}`);
   * });
   * ```
   */
  getEnabledWallets(): AdapterConfig[] {
    if (this.cachedEnabledWallets) {
      return this.cachedEnabledWallets;
    }

    this.cachedEnabledWallets = Object.entries(this.config.adapters)
      .filter(([_, wallet]) => wallet?.enabled !== false)
      .map(([id, wallet]) => ({
        ...wallet,
        id: wallet.id || id // Ensure id is always present
      })) as AdapterConfig[];

    return this.cachedEnabledWallets;
  }

  /**
   * Invalidate the enabled wallets cache.
   * Called internally when adapter configuration changes.
   * @private
   */
  private invalidateWalletCache(): void {
    this.cachedEnabledWallets = null;
  }

  /**
   * Get performance metrics and cache statistics.
   * @returns {Object} Performance statistics including cache stats, metrics, and timings
   * @returns {Object} returns.cache - Actor cache statistics
   * @returns {Object} returns.performance - Performance metrics
   * @returns {Object} returns.timings - Timing report
   */
  getPerformanceStats() {
    return {
      cache: this.actorManager.getCacheStats(),
      performance: globalPerformanceMonitor.getMetrics(),
      timings: globalPerformanceMonitor.getTimingReport(),
    };
  }
}

/**
 * Factory function to create a new PNP instance with configuration.
 * @param {CreatePnpArgs} [config={}] - Configuration object or ConfigBuilder
 * @returns {PNP} New PNP instance
 * @example
 * ```typescript
 * // Using object configuration
 * const pnp = createPNP({
 *   network: 'ic',
 *   adapters: {
 *     ii: { enabled: true },
 *     plug: { enabled: true }
 *   }
 * });
 * 
 * // Using ConfigBuilder
 * const pnp2 = createPNP(
 *   ConfigBuilder.create()
 *     .withEnvironment('local')
 *     .withAdapter('ii', { enabled: true })
 *     .build()
 * );
 * ```
 */
export const createPNP = (config: CreatePnpArgs = {}) => {
  const globalConfig = createPNPConfig(config);
  return new PNP(globalConfig);
};

// Export configuration types and builder
export { ConfigBuilder } from "./config";
export type { CreatePnpArgs };

// Export adapter extension types
export { 
  createAdapterExtension,
  type AdapterExtension,
  type ExtractAdapterIds
} from "./types/AdapterExtensions";

// Export base adapter classes for external packages
export { BaseAdapter } from './adapters/BaseAdapter';
export type { AdapterConstructorArgs } from './adapters/BaseAdapter';
export { BaseDelegationAdapter } from './adapters/BaseDelegationAdapter';
export { BaseSignerAdapter } from './adapters/BaseSignerAdapter';
export { BaseMultiChainAdapter } from './adapters/BaseMultiChainAdapter';
export type { NetworkDetection, MultiChainConfig } from './adapters/BaseMultiChainAdapter';

// Export SIWS/SIWE related adapters for cross-chain packages
export { BaseSiwxAdapter } from './adapters/BaseSiwxAdapter';
export { Adapter } from './types/index.d';
export type { Wallet } from './types/index.d';

// Export utilities needed by packages
export { deriveAccountId, formatSiwsMessage, processPrincipal } from './utils';
