import { GlobalPnpConfig } from './index.d';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export interface IIAdapterConfig extends GlobalPnpConfig {
  localIdentityCanisterId?: string;
  maxTimeToLive?: bigint;
  derivationOrigin?: string;
  iiProviderUrl?: string;
  iiProviderOrigin?: string;
  timeout?: number;
}

export interface PlugAdapterConfig extends GlobalPnpConfig {
  whitelist?: string[];
  host?: string;
  timeout?: number;
  dev?: boolean;
}

export interface NFIDAdapterConfig extends GlobalPnpConfig {
  appName?: string;
  logoUrl?: string;
  maxTimeToLive?: bigint;
  derivationOrigin?: string;
  signerUrl?: string;
  transport?: {
    windowOpenerFeatures?: string;
    establishTimeout?: number;
    disconnectTimeout?: number;
    statusPollingRate?: number;
    detectNonClickEstablishment?: boolean;
  };
}

export interface OisyAdapterConfig extends GlobalPnpConfig {
  appName?: string;
  logoUrl?: string;
  maxTimeToLive?: bigint;
  derivationOrigin?: string;
  signerUrl?: string;
  transport?: {
    windowOpenerFeatures?: string;
    establishTimeout?: number;
    disconnectTimeout?: number;
    statusPollingRate?: number;
    detectNonClickEstablishment?: boolean;
  };
}

export interface SiwsAdapterConfig extends GlobalPnpConfig {
  providerCanisterId?: string;
  maxTimeToLive?: bigint;
  derivationOrigin?: string;
  signInMessage?: string;
  signInDomain?: string;
  signInUri?: string;
  signInStatement?: string;
  signInNonce?: string;
  signInExpirationTime?: number;
  solanaNetwork?: WalletAdapterNetwork;
  // WalletConnect specific options
  projectId?: string;
  appName?: string;
  appDescription?: string;
  appUrl?: string;
  appIcons?: string[];
}

export interface StoicAdapterConfig extends GlobalPnpConfig {
  maxTimeToLive?: bigint;
  keyType?: 'ECDSA' | 'Ed25519';
}

export interface SiweAdapterConfig extends GlobalPnpConfig {
  siweProviderCanisterId?: string;
  providerCanisterId?: string;
  maxTimeToLive?: bigint;
  derivationOrigin?: string;
}

export interface LedgerAdapterConfig extends GlobalPnpConfig {
  derivePath?: string; // Default: "m/44'/223'/0'/0/0"
  appVersion?: string; // Minimum required app version
  enableICRC21?: boolean; // Enable ICRC-21 consent message support
  transport?: 'WebHID' | 'WebUSB'; // Transport type (default: WebHID)
}

// Union type for all adapter configs
export type AdapterSpecificConfig =
  | IIAdapterConfig
  | PlugAdapterConfig
  | NFIDAdapterConfig
  | OisyAdapterConfig
  | SiwsAdapterConfig
  | SiweAdapterConfig
  | StoicAdapterConfig
  | LedgerAdapterConfig;

// Generic type guard factory
function createTypeGuard<T extends GlobalPnpConfig>(
  ...keys: (keyof T)[]
): (config: unknown) => config is T {
  return (config: unknown): config is T => {
    if (!config || typeof config !== 'object') return false;
    return keys.some(key => key in config);
  };
}

// Simplified type guards using factory
export const isPlugAdapterConfig = createTypeGuard<PlugAdapterConfig>('whitelist', 'host');
export const isNFIDAdapterConfig = createTypeGuard<NFIDAdapterConfig>('appName', 'logoUrl');
export const isOisyAdapterConfig = createTypeGuard<OisyAdapterConfig>('appName', 'logoUrl');
export const isSiwsAdapterConfig = createTypeGuard<SiwsAdapterConfig>('providerCanisterId', 'signInMessage');
// Accept either explicit II-specific fields or the common GlobalPnpConfig keys (e.g., 'hostUrl')
export const isIIAdapterConfig = createTypeGuard<IIAdapterConfig>(
  'localIdentityCanisterId',
  'iiProviderUrl',
  'iiProviderOrigin',
  'hostUrl'
);
export const isSiweAdapterConfig = createTypeGuard<SiweAdapterConfig>('siweProviderCanisterId');
export const isStoicAdapterConfig = createTypeGuard<StoicAdapterConfig>('keyType');
export const isLedgerAdapterConfig = createTypeGuard<LedgerAdapterConfig>('derivePath', 'enableICRC21', 'transport'); 