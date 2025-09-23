/// <reference path="./assets.d.ts" />

// Coinbase Wallet Package for PNP

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

import { CoinbaseAdapter, type CoinbaseAdapterConfig } from './CoinbaseAdapter';
import { createAdapterExtension } from '@windoge98/plug-n-play';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Import Coinbase logo
import coinbaseLogo from '../assets/coinbase.svg';

/**
 * Coinbase Wallet extension for PNP
 * Provides Solana support via SIWS (Sign-In with Solana)
 */
export const CoinbaseExtension = createAdapterExtension({
  coinbase: {
    id: 'coinbase',
    enabled: false,
    walletName: 'Coinbase Wallet',
    logo: coinbaseLogo,
    website: 'https://www.coinbase.com/wallet',
    chain: 'SOL' as const,
    adapter: CoinbaseAdapter,
    config: {
      enabled: false,
      solanaNetwork: WalletAdapterNetwork.Mainnet,
      // Provider canister ID should be set by the user
      siwsProviderCanisterId: '',
    }
  }
});

// Export adapter and types
export { CoinbaseAdapter, type CoinbaseAdapterConfig };
export { formatSiwsMessage } from '@windoge98/plug-n-play';