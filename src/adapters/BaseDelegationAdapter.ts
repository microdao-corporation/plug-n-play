import { Ed25519KeyIdentity, DelegationIdentity, DelegationChain } from "@icp-sdk/core/identity";
import { Principal } from "@icp-sdk/core/principal";
import { BaseAdapter, AdapterConstructorArgs } from "./BaseAdapter";
import { AdapterSpecificConfig } from "../types/AdapterConfigs";
import { 
  IdbStorage, 
  getDelegationChain, 
  setDelegationChain, 
  removeDelegationChain,
  getIdentity,
  setIdentity,
  removeIdentity
} from "@slide-computer/signer-storage";
import { Adapter } from "../types/index.d";

/**
 * Base class for adapters that use delegation-based authentication with storage
 */
export abstract class BaseDelegationAdapter<T extends AdapterSpecificConfig = AdapterSpecificConfig> extends BaseAdapter<T> {
  protected storage: IdbStorage;
  protected sessionKey: Ed25519KeyIdentity | null = null;
  protected identity: DelegationIdentity | null = null;

  constructor(args: AdapterConstructorArgs<T>) {
    super(args);
    this.storage = new IdbStorage();
    this.initializeStorageRestore();
  }

  protected initializeStorageRestore(): void {
    // Attempt to restore from storage
    this.restoreFromStorage().catch(error => {
      this.logger.debug(`Failed to restore from storage on init:`, error);
    });
  }

  protected async restoreFromStorage(): Promise<void> {
    try {
      const storedSessionKey = await getIdentity(this.adapter.id, this.storage) as Ed25519KeyIdentity | undefined;
      const delegationChain = await getDelegationChain(this.adapter.id, this.storage);
      
      if (!storedSessionKey || !delegationChain) {
        this.logger.debug(`[${this.adapter.id}] No session key or delegation chain found in storage.`);
        await this.clearStoredSession();
        return;
      }

      // Check if delegation is still valid
      const expiration = delegationChain.delegations[0].delegation.expiration;
      if (expiration < BigInt(Date.now() * 1_000_000)) {
        this.logger.debug(`[${this.adapter.id}] Stored delegation chain has expired.`);
        await this.clearStoredSession();
        return;
      }
      
      this.sessionKey = storedSessionKey;
      this.identity = DelegationIdentity.fromDelegation(
        this.sessionKey,
        delegationChain
      );

      // Allow subclasses to perform additional restoration logic
      await this.onStorageRestored(storedSessionKey, delegationChain);
      
      this.setState(Adapter.Status.CONNECTED);
    } catch (error) {
      this.logger.error(`[${this.adapter.id}] Error restoring from storage:`, error);
      await this.clearStoredSession();
    }
  }

  protected async clearStoredSession(): Promise<void> {
    this.identity = null;
    this.sessionKey = null;
    await removeIdentity(this.adapter.id, this.storage);
    await removeDelegationChain(this.adapter.id, this.storage);
    
    // Allow subclasses to clear additional stored data
    await this.onClearStoredSession();
  }

  protected async storeSession(sessionKey: Ed25519KeyIdentity, delegationChain: DelegationChain): Promise<void> {
    await setIdentity(this.adapter.id, sessionKey, this.storage);
    await setDelegationChain(this.adapter.id, delegationChain, this.storage);
  }

  /**
   * Hook for subclasses to perform additional logic after restoring from storage
   * @param sessionKey - The restored session key
   * @param delegationChain - The restored delegation chain
   */
  protected abstract onStorageRestored(sessionKey: Ed25519KeyIdentity, delegationChain: DelegationChain): Promise<void>;
  
  /**
   * Hook for subclasses to perform additional cleanup when clearing stored session
   * Called after the base storage cleanup is complete
   */
  protected abstract onClearStoredSession(): Promise<void>;

  // Ensure delegation sessions are cleared on disconnect unless a subclass overrides and skips super
  protected async disconnectInternal(): Promise<void> {
    await super.disconnectInternal();
    await this.clearStoredSession();
  }

  /**
   * Dispose of delegation-specific resources
   * Cleans up storage and identity
   */
  protected async onDispose(): Promise<void> {
    // Clear stored session data
    await this.clearStoredSession();
    
    // Clean up identity
    this.identity = null;
    this.sessionKey = null;
    
    // Clean up storage if it has a cleanup method
    if (this.storage && 'close' in this.storage && typeof this.storage.close === 'function') {
      try {
        await (this.storage as any).close();
      } catch (error) {
        // Best effort - already disposing
      }
    }
  }
} 