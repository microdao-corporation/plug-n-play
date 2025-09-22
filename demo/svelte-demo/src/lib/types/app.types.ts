export interface AppConfig {
  network: 'ic' | 'local';
  siws?: string;
  siwe?: string;
  delegationTimeout: bigint;
  walletConnectProjectId?: string;
}

export interface LedgerState {
  balance: bigint | null;
  isLoading: boolean;
  error: string | null;
}