import { LedgerService } from '../services/ledger.service';

export function createLedgerState() {
  // State with runes
  let balance = $state<bigint | null>(null);
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  // Derived state
  const formattedBalance = $derived(
    LedgerService.formatICP(balance)
  );

  // Methods
  async function fetchBalance(principalId: string | null): Promise<void> {
    if (!principalId) {
      balance = null;
      return;
    }

    isLoading = true;
    error = null;

    try {
      const result = await LedgerService.getBalance(principalId);
      balance = result;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to fetch balance';
      console.error('Balance fetch failed:', err);
    } finally {
      isLoading = false;
    }
  }

  function reset(): void {
    balance = null;
    isLoading = false;
    error = null;
  }

  // Return getters and methods
  return {
    // State getters
    get balance() { return balance; },
    get formattedBalance() { return formattedBalance; },
    get isLoading() { return isLoading; },
    get error() { return error; },

    // Methods
    fetchBalance,
    reset,
  };
}

// Export function to create ledger state - to be used in components
export const useLedger = createLedgerState;