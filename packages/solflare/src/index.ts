/// <reference path="./assets.d.ts" />

// Solflare Wallet Package for PNP

// Initialize Buffer polyfill for browser environments
import { Buffer } from 'buffer';

// Extend window type for Buffer
declare global {
  interface Window {
    Buffer?: typeof Buffer;
    global?: Window;
  }
}

if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
  window.global = window;
}

import { SolflareAdapter, type SolflareAdapterConfig } from './SolflareAdapter';
import { createAdapterExtension } from '@windoge98/plug-n-play';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Import Solflare logo
import solflareLogo from '../assets/solflare.svg';

/**
 * Solflare Wallet extension for PNP
 * Provides Solana support via SIWS (Sign-In with Solana)
 */
export const SolflareExtension = createAdapterExtension({
  solflare: {
    id: 'solflare',
    enabled: false,
    walletName: 'Solflare',
    logo: solflareLogo,
    website: 'https://solflare.com',
    chain: 'SOL' as const,
    adapter: SolflareAdapter,
    config: {
      enabled: false,
      solanaNetwork: WalletAdapterNetwork.Mainnet,
      // Provider canister ID should be set by the user
      siwsProviderCanisterId: '',
    }
  }
});

// Export adapter and types
export { SolflareAdapter, type SolflareAdapterConfig };
export { formatSiwsMessage } from '@windoge98/plug-n-play';