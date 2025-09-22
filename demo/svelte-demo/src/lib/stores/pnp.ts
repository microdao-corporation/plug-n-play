import { writable, derived, get } from 'svelte/store';
// Import from source for development
import { PNP, createPNPConfig } from '../../../../../src';
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
export const lastEvent = writable<any>(null);
export const connectingWalletId = writable<string | null>(null);
export const error = writable<string | null>(null);
export const availableWallets = derived(pnpInstance, $p => $p?.getEnabledWallets() || []);

// Initialize PNP
const initPNP = () => {
    const config = createPNPConfig({
        network: 'ic',
        delegation: {
            timeout: BigInt(24 * 60 * 60 * 1000 * 1000 * 1000),
            targets: []
        },
        providers: {
            siws: 'guktk-fqaaa-aaaao-a4goa-cai',
            siwe: 'r4zqx-aiaaa-aaaar-qbuia-cai',
        },
        extensions: [PhantomExtension, SolflareExtension, WalletConnectExtension, MetaMaskExtension, RabbyExtension],
        adapters: {
            // IC adapters
            ii: { enabled: true },
            plug: {
                enabled: true,
            },
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
                projectId: 'YOUR_PROJECT_ID',
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

    const pnp = new PNP(config);

    pnpInstance.set(pnp);
    
    // Auto-reconnect IC wallets (not Solana/Ethereum/Hardware wallets)
    const stored = localStorage.getItem('pnpConnectedWallet');
    const nonAutoReconnectWallets = ['phantom', 'solflare', 'walletconnect', 'metamask', 'rabby', 'ledger'];
    if (stored && !nonAutoReconnectWallets.includes(stored)) {
        pnp.connect(stored).then(account => {
            if (account) {
                isConnected.set(true);
                principalId.set(account.owner);
                lastEvent.set({ type: 'reconnected', walletId: stored });
            }
        }).catch(() => localStorage.removeItem('pnpConnectedWallet'));
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

        console.log('Connected successfully:', account);

        // Update all stores
        console.log('Setting isConnected to true');
        isConnected.set(true);
        console.log('Setting principalId to:', account.owner);
        principalId.set(account.owner);
        connectingWalletId.set(null);

        // Debug: Check if stores actually updated
        console.log('Store values after update:', {
            isConnected: get(isConnected),
            principalId: get(principalId)
        });

        // Store the account on the PNP instance for later access
        (pnp as any).connectedAccount = account;

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