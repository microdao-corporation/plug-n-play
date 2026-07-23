import { writable, derived, get } from 'svelte/store';
// Import from source for development
import { PNP, ConfigBuilder } from '../../../../../src';
// Import wallet extensions from packages
import { PhantomExtension } from '../../../../../packages/phantom/src';
import { SolflareExtension } from '../../../../../packages/solflare/src';
import { WalletConnectExtension } from '../../../../../packages/walletconnect/src';
import { MetaMaskExtension } from '../../../../../packages/metamask/src';
import { RabbyExtension } from '../../../../../packages/rabby/src';

// Stores
export const pnpInstance = writable<PNP | null>(null);
export const isConnected = writable(false);
export const principalId = writable<string | null>(null);
export const subaccount = writable<string | null>(null);
export const lastEvent = writable<any>(null);
export const connectingWalletId = writable<string | null>(null);
export const error = writable<string | null>(null);
export const availableWallets = derived(pnpInstance, $p => $p?.getEnabledWallets() || []);

// Initialize PNP
const initPNP = () => {
    const pnp = new PNP(
        ConfigBuilder.create()
            .withEnvironment('ic')
            .withDelegation({
                timeout: BigInt(24 * 60 * 60 * 1000 * 1000 * 1000),
                targets: []
            })
            .withProviders({
                siws: 'guktk-fqaaa-aaaao-a4goa-cai',
                siwe: 'r4zqx-aiaaa-aaaar-qbuia-cai',
            })
            .withExtensions(PhantomExtension, SolflareExtension, WalletConnectExtension, MetaMaskExtension, RabbyExtension)
            .withIcAdapters()
            // Configure Plug wallet with account selection enabled (default)
            .withAdapter('plug', {
                enabled: true,
                // disableAccountSelection: false  // Uncomment to disable account selection UI
            })
            .withAdapter('computr', { enabled: true })
            // Solana wallets
            .withAdapter('phantom', { enabled: true })
            .withAdapter('solflare', { enabled: true })
            .withAdapter('walletconnect', {
                enabled: true,
                projectId: 'YOUR_PROJECT_ID',
                appName: 'PNP Demo',
                appDescription: 'Demo using WalletConnect',
                appUrl: 'https://example.com',
                appIcons: ['https://example.com/icon.png']
            })
            // Ethereum wallets
            .withAdapter('metamask', { enabled: true })
            .withAdapter('rabby', { enabled: true })
            .build()
    );

    pnpInstance.set(pnp);
    
    // Auto-reconnect IC wallets (not Solana/Ethereum wallets)
    const stored = localStorage.getItem('pnpConnectedWallet');
    const nonIcWallets = ['phantom', 'solflare', 'walletconnect', 'metamask', 'rabby'];
    if (stored && !nonIcWallets.includes(stored)) {
        pnp.connect(stored).then(account => {
            if (account) {
                isConnected.set(true);
                principalId.set(account.owner);
                subaccount.set(account.subaccount || null);
                lastEvent.set({ type: 'reconnected', walletId: stored });
            }
        }).catch((err) => { console.warn('[PNP auto-reconnect] failed for', stored, err); localStorage.removeItem('pnpConnectedWallet'); });
    }
    return pnp;
};

// Helper to reset state
const resetState = () => {
    isConnected.set(false);
    principalId.set(null);
    connectingWalletId.set(null);
};

// Connect wallet
export const connectWallet = async (walletId: string) => {
    const pnp = get(pnpInstance);
    if (!pnp) throw new Error('PNP not initialized');
    
    resetState();
    connectingWalletId.set(walletId);
    lastEvent.set({ type: 'statusChange', status: 'CONNECTING', walletId });

    try {
        const account = await pnp.connect(walletId);
        if (!account) throw new Error("Connection cancelled");
        
        isConnected.set(true);
        principalId.set(account.owner);
        subaccount.set(account.subaccount || null);
        connectingWalletId.set(null);
        lastEvent.set({ type: 'connected', walletId, principal: account.owner });
        localStorage.setItem('pnpConnectedWallet', walletId);
        
        return account;
    } catch (err) {
        resetState();
        lastEvent.set({ type: 'error', message: err.message });
        throw err;
    }
};

// Disconnect wallet
export const disconnectWallet = async () => {
    const pnp = get(pnpInstance);
    if (!pnp) return;

    try {
        await pnp.disconnect();
        resetState();
        localStorage.removeItem('pnpConnectedWallet');
        lastEvent.set({ type: 'disconnected' });
    } catch (err) {
        resetState();
        throw err;
    }
};

// Initialize on load
initPNP();