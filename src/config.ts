import { Adapter } from "./types";
import { Adapters } from "./adapters";
import { GlobalPnpConfig } from ".";
import { AdapterExtension, mergeAdapterExtensions } from "./types/AdapterExtensions";

// Clean configuration input
export interface CreatePnpArgs {
  network?: 'local' | 'ic';
  ports?: { replica?: number; frontend?: number };
  delegation?: { timeout?: bigint; targets?: string[] };
  security?: { fetchRootKey?: boolean; verifyQuerySignatures?: boolean };
  storage?: { key?: string };
  providers?: {
    siws?: string;
    siwe?: string; 
    frontend?: string;
  };
  extensions?: AdapterExtension<any>[]; // New: declarative adapter extensions
  adapters?: Record<string, AdapterOverride>;
}

// Adapter override with flat structure
type AdapterOverride = {
  enabled?: boolean;
  [key: string]: any;
};

// Defaults
const DEFAULTS = {
  network: 'ic' as const,
  ports: { replica: 8080, frontend: 3000 },
  delegation: {
    timeout: BigInt(24 * 60 * 60 * 1000 * 1000 * 1000),
    targets: [] as string[]
  },
  storage: { key: 'pnpState' }
};

// Clean configuration factory  
export function createPNPConfig(input: CreatePnpArgs = {}): GlobalPnpConfig {
  const network = input.network || DEFAULTS.network;
  const isLocal = network === 'local';
  const ports = { ...DEFAULTS.ports, ...input.ports };
  const delegation = { ...DEFAULTS.delegation, ...input.delegation };
  const storage = { ...DEFAULTS.storage, ...input.storage };
  const providers = input.providers || {};
  
  // Computed values
  const hostUrl = isLocal 
    ? `http://127.0.0.1:${ports.replica}`
    : 'https://icp0.io';
    
  const derivationOrigin = providers.frontend && !isLocal
    ? `https://${providers.frontend}.icp0.io`
    : `http://localhost:${ports.frontend}`;

  // Merge extensions if provided
  const extensionAdapters = input.extensions 
    ? mergeAdapterExtensions(...input.extensions)
    : {};
  
  // Process adapters with concise merging
  const adapters: Record<string, Adapter.Config> = {};
  const adapterIds = new Set([
    ...Object.keys(Adapters),
    ...Object.keys(extensionAdapters),
    ...Object.keys(input.adapters || {})
  ]);
  
  
  for (const id of adapterIds) {
    // Check in order: built-in, extensions, overrides
    const base = Adapters[id] || extensionAdapters[id];
    const override = input.adapters?.[id];
    
    
    // Custom adapter without base
    if (!base && override?.adapter) {
      adapters[id] = override as any;
      continue;
    }
    
    if (!base) continue;
    
    // Merge configuration efficiently
    adapters[id] = {
      ...base,
      enabled: override?.enabled ?? base.enabled,
      config: {
        ...base.config,
        // Global settings
        hostUrl,
        derivationOrigin,
        fetchRootKey: input.security?.fetchRootKey ?? isLocal,
        verifyQuerySignatures: input.security?.verifyQuerySignatures ?? !isLocal,
        delegationTimeout: delegation.timeout,
        delegationTargets: delegation.targets,
        localStorageKey: storage.key,
        // Provider IDs
        siwsProviderCanisterId: providers.siws,
        siweProviderCanisterId: providers.siwe,
        frontendCanisterId: providers.frontend,
        // Adapter-specific overrides (excluding 'enabled' and 'config')
        ...Object.fromEntries(
          Object.entries(override || {})
            .filter(([k]) => k !== 'enabled' && k !== 'config')
        ),
        // Merge user's config overrides last to allow per-adapter customization
        ...(override?.config || {})
      }
    };
  }

  // Return clean global config
  return {
    dfxNetwork: network,
    replicaPort: ports.replica,
    hostUrl,
    delegationTimeout: delegation.timeout,
    delegationTargets: delegation.targets,
    derivationOrigin,
    fetchRootKey: input.security?.fetchRootKey ?? isLocal,
    verifyQuerySignatures: input.security?.verifyQuerySignatures ?? !isLocal,
    localStorageKey: storage.key,
    siwsProviderCanisterId: providers.siws,
    siweProviderCanisterId: providers.siwe,
    adapters
  };
}
