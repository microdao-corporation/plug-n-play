import { ActorSubclass } from '@icp-sdk/core/agent';
import { GlobalPnpConfig } from './types/index.d';
import { AdapterConfig, GetActorOptions } from './types/AdapterTypes';
import { WalletAccount } from './types/WalletTypes';
import { createPNPConfig, CreatePnpArgs } from './config';
import { PnpState, StateResponse, StateTransition } from './managers/StateManager';
export { createPNPConfig, PnpState };
export type { GlobalPnpConfig, StateResponse, StateTransition };
export type { ActorSubclass, GetActorOptions };
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
    getIcrcActor: <T>(canisterId: string, options?: {
        anon?: boolean;
        requiresSigning?: boolean;
    }) => ActorSubclass<T>;
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
export declare class PNP implements PnpInterface {
    private configManager;
    private connectionManager;
    private actorManager;
    private errorManager;
    private stateManager;
    private cachedEnabledWallets;
    private static adapterRegistry;
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
    static registerAdapter(id: string, config: AdapterConfig): void;
    /**
     * Unregister an adapter by id.
     * @param id - Adapter id to remove
     */
    static unregisterAdapter(id: string): void;
    /**
     * Get all registered adapters.
     * @returns Object containing all registered adapters
     */
    static getRegisteredAdapters(): Record<string, AdapterConfig>;
    /**
     * Creates a new PNP instance.
     * @param config - Configuration object for PNP
     */
    constructor(config?: GlobalPnpConfig);
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
    openChannel(): Promise<void>;
    /**
     * Get the current configuration object.
     * @returns {GlobalPnpConfig} Current configuration
     */
    get config(): GlobalPnpConfig;
    /**
     * Get the currently active adapter.
     * @returns {AdapterConfig | null} Active adapter or null if not connected
     */
    get adapter(): AdapterConfig;
    /**
     * Get the current wallet provider instance.
     * @returns {any} Provider instance or null
     */
    get provider(): import('./types/AdapterTypes').AdapterInterface;
    /**
     * Get the connected wallet account details.
     * @returns {WalletAccount | null} Account details or null if not connected
     */
    get account(): WalletAccount;
    /**
     * Get the current connection status.
     * @returns {any} Connection status
     */
    get status(): import('./types/AdapterTypes').AdapterStatus;
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
    connect(walletId?: string): Promise<WalletAccount>;
    /**
     * Disconnect from the current wallet.
     * @returns Promise that resolves when disconnected
     * @throws If disconnection fails
     */
    disconnect(): Promise<void>;
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
    getActor<T>(options: GetActorOptions): ActorSubclass<T>;
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
    getIcrcActor<T>(canisterId: string, options?: {
        anon?: boolean;
        requiresSigning?: boolean;
    }): ActorSubclass<T>;
    /**
     * Check if user is authenticated with a wallet.
     * @returns {boolean} True if authenticated, false otherwise
     */
    isAuthenticated(): boolean;
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
    getEnabledWallets(): AdapterConfig[];
    /**
     * Invalidate the enabled wallets cache.
     * Called internally when adapter configuration changes.
     * @private
     */
    private invalidateWalletCache;
    /**
     * Get performance metrics and cache statistics.
     * @returns {Object} Performance statistics including cache stats, metrics, and timings
     * @returns {Object} returns.cache - Actor cache statistics
     * @returns {Object} returns.performance - Performance metrics
     * @returns {Object} returns.timings - Timing report
     */
    getPerformanceStats(): {
        cache: {
            size: number;
            maxSize: number;
            hitRate?: number;
        };
        performance: import('./utils/PerformanceMonitor').PerformanceMetrics;
        timings: Record<string, {
            count: number;
            average: number;
            p50: number;
            p95: number;
            p99: number;
            successRate: number;
        }>;
    };
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
export declare const createPNP: (config?: CreatePnpArgs) => PNP;
export { ConfigBuilder } from './config';
export type { CreatePnpArgs };
export { createAdapterExtension, type AdapterExtension, type ExtractAdapterIds } from './types/AdapterExtensions';
export { BaseAdapter } from './adapters/BaseAdapter';
export type { AdapterConstructorArgs } from './adapters/BaseAdapter';
export { BaseDelegationAdapter } from './adapters/BaseDelegationAdapter';
export { BaseSignerAdapter } from './adapters/BaseSignerAdapter';
export { BaseMultiChainAdapter } from './adapters/BaseMultiChainAdapter';
export type { NetworkDetection, MultiChainConfig } from './adapters/BaseMultiChainAdapter';
export { BaseSiwxAdapter } from './adapters/BaseSiwxAdapter';
export { Adapter } from './types/index.d';
export type { Wallet } from './types/index.d';
export { deriveAccountId, formatSiwsMessage, processPrincipal } from './utils';
