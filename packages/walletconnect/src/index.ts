/// <reference path="./assets.d.ts" />

// WalletConnect Package for PNP

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

import { WalletConnectAdapter, type WalletConnectAdapterConfig } from './WalletConnectAdapter';
import { createAdapterExtension } from '@windoge98/plug-n-play';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Import WalletConnect logo
import walletConnectLogo from '../assets/walletconnect.webp';

/**
 * WalletConnect extension for PNP
 * Provides Solana support via SIWS (Sign-In with Solana)
 * Supports multiple Solana wallets through WalletConnect protocol
 */
export const WalletConnectExtension = createAdapterExtension({
  walletconnect: {
    id: 'walletconnect',
    enabled: false,
    walletName: 'WalletConnect',
    logo: walletConnectLogo,
    website: 'https://walletconnect.com',
    chain: 'SOL' as const,
    adapter: WalletConnectAdapter,
    config: {
      enabled: false,
      solanaNetwork: WalletAdapterNetwork.Mainnet,
      // Provider canister ID should be set by the user
      siwsProviderCanisterId: '',
      // WalletConnect specific config
      projectId: 'YOUR_PROJECT_ID',
      appName: 'Your App',
      appDescription: 'A dApp using WalletConnect for Solana',
      appUrl: 'https://yourapp.com',
      appIcons: ['https://yourapp.com/logo.png'],
    }
  }
});

// Export adapter and types
export { WalletConnectAdapter, type WalletConnectAdapterConfig };
export { formatSiwsMessage } from '@windoge98/plug-n-play';