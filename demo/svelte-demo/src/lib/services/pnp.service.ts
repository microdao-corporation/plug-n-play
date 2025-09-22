// Import from source for development
import { PNP, createPNPConfig } from '../../../../../src';
// Import wallet extensions from packages
import { PhantomExtension } from '../../../../../packages/phantom/src';
import { SolflareExtension } from '../../../../../packages/solflare/src';
import { WalletConnectExtension } from '../../../../../packages/walletconnect/src';
import { MetaMaskExtension } from '../../../../../packages/metamask/src';
import { RabbyExtension } from '../../../../../packages/rabby/src';
import type { AppConfig } from '../types/app.types';

export class PNPService {
  private static instance: PNP | null = null;

  static initialize(config?: Partial<AppConfig>): PNP {
    if (this.instance) return this.instance;

    const defaultConfig: AppConfig = {
      network: 'ic',
      siws: 'guktk-fqaaa-aaaao-a4goa-cai',
      siwe: 'r4zqx-aiaaa-aaaar-qbuia-cai',
      delegationTimeout: BigInt(24 * 60 * 60 * 1000 * 1000 * 1000),
      walletConnectProjectId: 'YOUR_PROJECT_ID',
    };

    const mergedConfig = { ...defaultConfig, ...config };

    const pnpConfig = createPNPConfig({
      network: mergedConfig.network,
      delegation: {
        timeout: mergedConfig.delegationTimeout,
        targets: []
      },
      providers: {
        siws: mergedConfig.siws,
        siwe: mergedConfig.siwe,
      },
      extensions: [
        PhantomExtension,
        SolflareExtension,
        WalletConnectExtension,
        MetaMaskExtension,
        RabbyExtension
      ],
      adapters: {
        // IC adapters
        ii: { enabled: true },
        plug: { enabled: true },
        oisy: { enabled: true },
        nfid: { enabled: true },
        stoic: { enabled: true },
        ledger: {
          enabled: true,
          derivePath: "m/44'/223'/0'/0/0",
          enableICRC21: true
        },
        // Solana wallets
        phantom: { enabled: true },
        solflare: { enabled: true },
        walletconnect: {
          enabled: true,
          projectId: mergedConfig.walletConnectProjectId!,
          appName: 'PNP Demo',
          appDescription: 'Demo using WalletConnect',
          appUrl: 'https://example.com',
          appIcons: ['https://example.com/icon.png']
        },
        // Ethereum wallets
        metamask: { enabled: true },
        rabby: { enabled: true }
      }
    });

    this.instance = new PNP(pnpConfig);
    return this.instance;
  }

  static getInstance(): PNP | null {
    return this.instance;
  }

  static destroy(): void {
    if (this.instance) {
      this.instance.disconnect().catch(console.error);
      this.instance = null;
    }
  }
}