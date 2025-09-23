/// <reference path="./assets.d.ts" />

// Phantom Wallet Package for PNP

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

import { PhantomAdapter, type PhantomAdapterConfig } from './PhantomAdapter';
import { createAdapterExtension } from '@windoge98/plug-n-play';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Import Phantom logo
import phantomLogo from '../assets/phantom.webp';

/**
 * Phantom Wallet extension for PNP
 * Provides Solana support via SIWS (Sign-In with Solana)
 */
export const PhantomExtension = createAdapterExtension({
  phantom: {
    id: 'phantom',
    enabled: false,
    walletName: 'Phantom',
    logo: phantomLogo,
    website: 'https://phantom.app',
    chain: 'SOL' as const,
    adapter: PhantomAdapter,
    config: {
      enabled: false,
      solanaNetwork: WalletAdapterNetwork.Mainnet,
      // Provider canister ID should be set by the user
      siwsProviderCanisterId: '',
    }
  }
});

// Export adapter and types
export { PhantomAdapter, type PhantomAdapterConfig };
export { formatSiwsMessage } from '@windoge98/plug-n-play';