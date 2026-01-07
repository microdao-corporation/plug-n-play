import { Actor, HttpAgent, ActorSubclass } from "@icp-sdk/core/agent";
import { AdapterInterface, GetActorOptions } from "../types/AdapterTypes";
import { GlobalPnpConfig } from "../types/index.d";
import { fetchRootKeyIfNeeded } from "../utils";
import { TTLLRUCache } from "../utils/LRUCache";
import { globalPerformanceMonitor } from "../utils/PerformanceMonitor";

export class ActorManager {
  private config: GlobalPnpConfig;
  private provider: AdapterInterface | null;
  private actorCache: TTLLRUCache<string, ActorSubclass<any>>;

  constructor(
    config: GlobalPnpConfig,
    provider: AdapterInterface | null = null
  ) {
    this.config = config;
    this.provider = provider;
    // Initialize LRU cache with 50 actors max and 5 minute TTL
    this.actorCache = new TTLLRUCache(50, 5 * 60 * 1000);
  }

  setProvider(provider: AdapterInterface | null) {
    this.provider = provider;
  }

  getActor<T>(options: GetActorOptions): ActorSubclass<T> {
    const { canisterId, idl, anon = false, requiresSigning = false } = options;
    if (anon) {
      return this.createAnonymousActor<T>(canisterId, idl);
    }
    if (!this.provider) {
      throw new Error(
        "Cannot create signed actor. No wallet provider connected."
      );
    }
    const actor = this.provider.createActor<T>(canisterId, idl, {
      requiresSigning,
    });
    return actor;
  }

  createAnonymousActor<T>(canisterId: string, idl: any): ActorSubclass<T> {
    const cacheKey = `anon-${canisterId}`;
    
    // Check cache first
    const cachedActor = this.actorCache.getValue(cacheKey);
    if (cachedActor) {
      globalPerformanceMonitor.recordCacheAccess(true);
      return cachedActor as ActorSubclass<T>;
    }
    
    globalPerformanceMonitor.recordCacheAccess(false);
    
    // Check if actor creation is already in progress (deduplication)
    // Note: We can't actually return a pending promise here since we need synchronous return for Safari
    // This is a limitation we accept for Safari compatibility
    
    // Create actor synchronously (required for Safari)
    const createActor = () => {
      const timingKey = globalPerformanceMonitor.startTiming('actorCreation', canisterId);
      
      const agent = HttpAgent.createSync({
        host: this.config.hostUrl,
        verifyQuerySignatures: this.config.verifyQuerySignatures,
      });
      fetchRootKeyIfNeeded(agent, this.config.fetchRootKey);
      const actor = Actor.createActor<T>(idl, {
        agent,
        canisterId,
      });
      
      // Cache the actor with TTL
      this.actorCache.setValue(cacheKey, actor);
      
      globalPerformanceMonitor.endTiming(timingKey, true);
      
      return actor;
    };
    
    const actor = createActor();
    return actor;
  }

  clearCache() {
    this.actorCache.clear();
  }

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats() {
    return this.actorCache.getStats();
  }

  /**
   * Clean up expired cache entries
   */
  cleanupExpiredCache(): number {
    return this.actorCache.cleanupExpired();
  }
}
