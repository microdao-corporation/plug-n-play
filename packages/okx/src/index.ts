// OKX Wallet Package for PNP

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

import { OkxMultiChainAdapter, type OkxMultiChainConfig } from './OkxMultiChainAdapter';
import { createAdapterExtension } from '@windoge98/plug-n-play';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// OKX logo as data URL (black background with white OKX logo)
const okxLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTI0LjA0MDkgMTQuNzAxOUgyOC44OTI1QzI5LjE3NzEgMTQuNzAxOSAyOS40MDc1IDE0LjkzMjMgMjkuNDA3NSAxNS4yMTY5VjIwLjA2ODRDMjkuNDA3NSAyMC4zNTMgMjkuMTc3MSAyMC41ODM0IDI4Ljg5MjUgMjAuNTgzNEgyNC4wNDA5QzIzLjc1NjMgMjAuNTgzNCAyMy41MjU5IDIwLjM1MyAyMy41MjU5IDIwLjA2ODRWMTUuMjE2OUMyMy41MjU5IDE0LjkzMjMgMjMuNzU2MyAxNC43MDE5IDI0LjA0MDkgMTQuNzAxOVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMC4xMDcxIDE0LjcwMTlIMTQuOTU4N0MxNS4yNDMzIDE0LjcwMTkgMTUuNDczNyAxNC45MzIzIDE1LjQ3MzcgMTUuMjE2OVYyMC4wNjg0QzE1LjQ3MzcgMjAuMzUzIDE1LjI0MzMgMjAuNTgzNCAxNC45NTg3IDIwLjU4MzRIMTAuMTA3MUM5LjgyMjUgMjAuNTgzNCA5LjU5MjEgMjAuMzUzIDkuNTkyMSAyMC4wNjg0VjE1LjIxNjlDOS41OTIxIDE0LjkzMjMgOS44MjI1IDE0LjcwMTkgMTAuMTA3MSAxNC43MDE5WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTI0LjA0MDkgNS41SDI4Ljg5MjVDMjkuMTc3MSA1LjUgMjkuNDA3NSA1LjczMDQgMjkuNDA3NSA2LjAxNVYxMC44NjY1QzI5LjQwNzUgMTEuMTUxMSAyOS4xNzcxIDExLjM4MTUgMjguODkyNSAxMS4zODE1SDI0LjA0MDlDMjMuNzU2MyAxMS4zODE1IDIzLjUyNTkgMTEuMTUxMSAyMy41MjU5IDEwLjg2NjVWNi4wMTVDMjMuNTI1OSA1LjczMDQgMjMuNzU2MyA1LjUgMjQuMDQwOSA1LjVaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTAuMTA3MSA1LjVIMTQuOTU4N0MxNS4yNDMzIDUuNSAxNS40NzM3IDUuNzMwNCAxNS40NzM3IDYuMDE1VjEwLjg2NjVDMTUuNDczNyAxMS4xNTExIDE1LjI0MzMgMTEuMzgxNSAxNC45NTg3IDExLjM4MTVIMTAuMTA3MUM5LjgyMjUgMTEuMzgxNSA5LjU5MjEgMTEuMTUxMSA5LjU5MjEgMTAuODY2NVY2LjAxNUM5LjU5MjEgNS43MzA0IDkuODIyNSA1LjUgMTAuMTA3MSA1LjVaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQuMDQwOSAyMy45MDM3SDI4Ljg5MjVDMjkuMTc3MSAyMy45MDM3IDI5LjQwNzUgMjQuMTM0MSAyOS40MDc1IDI0LjQxODdWMjkuMjcwM0MyOS40MDc1IDI5LjU1NDkgMjkuMTc3MSAyOS43ODUzIDI4Ljg5MjUgMjkuNzg1M0gyNC4wNDA5QzIzLjc1NjMgMjkuNzg1MyAyMy41MjU5IDI5LjU1NDkgMjMuNTI1OSAyOS4yNzAzVjI0LjQxODdDMjMuNTI1OSAyNC4xMzQxIDIzLjc1NjMgMjMuOTAzNyAyNC4wNDA5IDIzLjkwMzdaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTAuMTA3MSAyMy45MDM3SDE0Ljk1ODdDMTUuMjQzMyAyMy45MDM3IDE1LjQ3MzcgMjQuMTM0MSAxNS40NzM3IDI0LjQxODdWMjkuMjcwM0MxNS40NzM3IDI5LjU1NDkgMTUuMjQzMyAyOS43ODUzIDE0Ljk1ODcgMjkuNzg1M0gxMC4xMDcxQzkuODIyNSAyOS43ODUzIDkuNTkyMSAyOS41NTQ5IDkuNTkyMSAyOS4yNzAzVjI0LjQxODdDOS41OTIxIDI0LjEzNDEgOS44MjI1IDIzLjkwMzcgMTAuMTA3MSAyMy45MDM3WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE3LjA3NCAxNC43MDE5SDIxLjkyNTVDMjIuMjEwMSAxNC43MDE5IDIyLjQ0MDUgMTQuOTMyMyAyMi40NDA1IDE1LjIxNjlWMjAuMDY4NEMyMi40NDA1IDIwLjM1MyAyMi4yMTAxIDIwLjU4MzQgMjEuOTI1NSAyMC41ODM0SDE3LjA3NEMxNi43ODk0IDIwLjU4MzQgMTYuNTU5IDIwLjM1MyAxNi41NTkgMjAuMDY4NFYxNS4yMTY5QzE2LjU1OSAxNC45MzIzIDE2Ljc4OTQgMTQuNzAxOSAxNy4wNzQgMTQuNzAxOVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==';

/**
 * OKX Wallet extension for PNP
 * Provides Solana support via SIWS
 */
export const OkxExtension = createAdapterExtension({
  okx: {
    id: 'okx',
    enabled: false,
    walletName: 'OKX Wallet',
    logo: okxLogo,
    website: 'https://www.okx.com/web3',
    chain: 'SOL' as const,
    adapter: OkxMultiChainAdapter,
    config: {
      enabled: false,
      supportedNetworks: ['solana'],
      solanaNetwork: WalletAdapterNetwork.Mainnet,
      // Provider canister ID should be set by the user
      siwsProviderCanisterId: '',
    }
  }
});

// Export adapter and types
export { OkxMultiChainAdapter, type OkxMultiChainConfig };