import { PNPService } from '../services/pnp.service';
import type { WalletInfo, WalletEvent, ConnectedAccount } from '../types/wallet.types';

const NON_AUTO_RECONNECT_WALLETS = ['phantom', 'solflare', 'walletconnect', 'metamask', 'rabby', 'ledger'];

export function createWalletState() {
  // State with runes
  let isConnected = $state(false);
  let principalId = $state<string | null>(null);
  let connectingWalletId = $state<string | null>(null);
  let error = $state<string | null>(null);
  let lastEvent = $state<WalletEvent | null>(null);
  let connectedAccount = $state<ConnectedAccount | null>(null);

  // Initialize PNP
  const pnp = PNPService.initialize();

  // Derived state
  const availableWallets = $derived<WalletInfo[]>(
    pnp.getEnabledWallets() as WalletInfo[]
  );

  // Auto-reconnect method (to be called from component)
  function autoReconnect() {
    const stored = localStorage.getItem('pnpConnectedWallet');
    if (stored && !NON_AUTO_RECONNECT_WALLETS.includes(stored)) {
      pnp.connect(stored).then(account => {
        if (account) {
          isConnected = true;
          principalId = account.owner;
          connectedAccount = account as ConnectedAccount;
          lastEvent = { type: 'reconnected', walletId: stored };
        }
      }).catch(() => {
        localStorage.removeItem('pnpConnectedWallet');
      });
    }
  }

  // Methods
  async function connect(walletId: string): Promise<void> {
    error = null;
    connectingWalletId = walletId;
    lastEvent = { type: 'statusChange', status: 'CONNECTING', walletId };

    try {
      const account = await pnp.connect(walletId);
      if (!account) throw new Error('Connection cancelled');

      isConnected = true;
      principalId = account.owner;
      connectedAccount = account as ConnectedAccount;
      connectingWalletId = null;
      lastEvent = { type: 'connected', walletId, principal: account.owner };

      localStorage.setItem('pnpConnectedWallet', walletId);
    } catch (err) {
      isConnected = false;
      principalId = null;
      connectedAccount = null;
      connectingWalletId = null;
      error = err instanceof Error ? err.message : 'Connection failed';
      lastEvent = { type: 'error', message: error };
      throw err;
    }
  }

  async function disconnect(): Promise<void> {
    try {
      await pnp.disconnect();
      isConnected = false;
      principalId = null;
      connectedAccount = null;
      connectingWalletId = null;
      error = null;
      localStorage.removeItem('pnpConnectedWallet');
      lastEvent = { type: 'disconnected' };
    } catch (err) {
      isConnected = false;
      principalId = null;
      connectedAccount = null;
      error = err instanceof Error ? err.message : 'Disconnect failed';
      throw err;
    }
  }

  function clearError(): void {
    error = null;
  }

  // Return getters and methods
  return {
    // State getters
    get isConnected() { return isConnected; },
    get principalId() { return principalId; },
    get connectingWalletId() { return connectingWalletId; },
    get error() { return error; },
    get lastEvent() { return lastEvent; },
    get availableWallets() { return availableWallets; },
    get connectedAccount() { return connectedAccount; },

    // Methods
    connect,
    disconnect,
    clearError,
    autoReconnect,
  };
}

// Export function to create wallet state - to be used in components
export const useWallet = createWalletState;