// Base class for multi-chain wallet adapters
import { BaseAdapter, AdapterConstructorArgs } from './BaseAdapter';
import { Adapter, Wallet } from '../types/index.d';
import type { GlobalPnpConfig } from '../types/index.d';
import { ActorSubclass } from '@icp-sdk/core/agent';

/**
 * Network detection result containing network information
 */
export interface NetworkDetection {
  network: 'ethereum' | 'solana' | 'bitcoin' | string;
  chainId?: string;
  isTestnet?: boolean;
}

/**
 * Configuration for multi-chain adapters
 */
export interface MultiChainConfig extends GlobalPnpConfig {
  supportedNetworks: string[];
  siwsProviderCanisterId?: string;
  siweProviderCanisterId?: string;
  // Add more provider canisters as needed for other networks
}

/**
 * Abstract base class for adapters that support multiple blockchain networks
 * Provides standardized network detection and adapter delegation
 */
export abstract class BaseMultiChainAdapter<T extends MultiChainConfig = MultiChainConfig> 
  extends BaseAdapter<T> {
  
  protected currentNetwork: NetworkDetection | null = null;
  protected networkAdapters: Map<string, BaseAdapter> = new Map();
  
  /**
   * Detect which network the wallet is currently connected to
   * Must be implemented by each multi-chain wallet adapter
   */
  abstract detectNetwork(): Promise<NetworkDetection>;
  
  /**
   * Get or create the appropriate network-specific adapter
   * Must be implemented to return the correct adapter for each network
   */
  protected abstract getNetworkAdapter(network: NetworkDetection): Promise<BaseAdapter>;
  
  /**
   * Check if the wallet supports a specific network
   */
  protected supportsNetwork(network: string): boolean {
    return this.config.supportedNetworks.includes(network);
  }
  
  /**
   * Get the currently active network
   */
  getCurrentNetwork(): NetworkDetection | null {
    return this.currentNetwork;
  }
  
  async connect(): Promise<Wallet.Account> {
    this.setState(Adapter.Status.CONNECTING);
    
    try {
      // Detect current network
      this.currentNetwork = await this.detectNetwork();
      this.logger.debug(`Detected network: ${this.currentNetwork.network}`, {
        network: this.currentNetwork,
        wallet: this.adapter.walletName
      });
      
      // Validate network is supported
      if (!this.supportsNetwork(this.currentNetwork.network)) {
        throw new Error(
          `${this.adapter.walletName} is on ${this.currentNetwork.network} which is not supported. ` +
          `Supported networks: ${this.config.supportedNetworks.join(', ')}`
        );
      }
      
      // Get appropriate adapter for the network
      const networkAdapter = await this.getNetworkAdapter(this.currentNetwork);
      this.networkAdapters.set(this.currentNetwork.network, networkAdapter);
      
      // Delegate connection to network-specific adapter
      const account = await networkAdapter.connect();
      
      this.setState(Adapter.Status.CONNECTED);
      return account;
      
    } catch (error) {
      this.handleError('Multi-chain connection failed', error);
      this.setState(Adapter.Status.ERROR);
      throw error;
    }
  }
  
  async disconnect(): Promise<void> {
    this.setState(Adapter.Status.DISCONNECTING);
    
    try {
      // Disconnect all network adapters
      for (const [network, adapter] of this.networkAdapters.entries()) {
        try {
          await adapter.disconnect();
        } catch (error) {
          this.logger.warn(`Failed to disconnect ${network} adapter`, {
            error,
            network,
            wallet: this.adapter.walletName
          });
        }
      }
      
      this.networkAdapters.clear();
      this.currentNetwork = null;
      
    } catch (error) {
      this.handleError('Multi-chain disconnect failed', error);
    } finally {
      this.setState(Adapter.Status.DISCONNECTED);
    }
  }
  
  async isConnected(): Promise<boolean> {
    if (!this.currentNetwork) {
      return false;
    }
    
    const adapter = this.networkAdapters.get(this.currentNetwork.network);
    if (!adapter) {
      return false;
    }
    
    return adapter.isConnected();
  }
  
  async getAddresses(): Promise<Adapter.Addresses> {
    if (!this.currentNetwork) {
      throw new Error("Not connected to any network");
    }
    
    const adapter = this.networkAdapters.get(this.currentNetwork.network);
    if (!adapter) {
      throw new Error("Network adapter not initialized");
    }
    
    const addresses = await adapter.getAddresses();
    
    // Add network information to addresses
    return {
      ...addresses,
      currentNetwork: this.currentNetwork.network,
      chainId: this.currentNetwork.chainId,
    };
  }
  
  async getPrincipal(): Promise<string> {
    const activeAdapter = this.getActiveAdapter();
    return activeAdapter.getPrincipal();
  }
  
  async getAccountId(): Promise<string> {
    const activeAdapter = this.getActiveAdapter();
    return activeAdapter.getAccountId();
  }
  
  /**
   * Get the currently active network adapter
   * @throws {Error} If not connected or adapter not found
   */
  protected getActiveAdapter(): BaseAdapter {
    if (!this.currentNetwork) {
      throw new Error("Not connected to any network");
    }
    
    const adapter = this.networkAdapters.get(this.currentNetwork.network);
    if (!adapter) {
      throw new Error(`No adapter found for network: ${this.currentNetwork.network}`);
    }
    
    return adapter;
  }
  
  protected createActorInternal<T>(
    canisterId: string,
    idl: any,
    options?: { requiresSigning?: boolean }
  ): ActorSubclass<T> {
    const activeAdapter = this.getActiveAdapter();
    return activeAdapter.createActor<T>(canisterId, idl, options);
  }
  
  /**
   * Switch to a different network (if supported by the wallet)
   * Optional method that wallets can implement if they support programmatic network switching
   */
  async switchNetwork?(targetNetwork: string): Promise<void> {
    throw new Error(`Network switching not implemented for ${this.adapter.walletName}`);
  }
  
  protected async onDispose(): Promise<void> {
    // Clean up all network adapters
    for (const adapter of this.networkAdapters.values()) {
      if ('dispose' in adapter && typeof adapter.dispose === 'function') {
        await (adapter as any).dispose();
      }
    }
    this.networkAdapters.clear();
  }
}