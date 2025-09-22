export interface WalletState {
  isConnected: boolean;
  principalId: string | null;
  connectingWalletId: string | null;
  error: string | null;
  lastEvent: WalletEvent | null;
}

export interface WalletEvent {
  type: 'connected' | 'disconnected' | 'reconnected' | 'error' | 'statusChange';
  walletId?: string;
  principal?: string;
  message?: string;
  status?: string;
}

export interface WalletInfo {
  id: string;
  walletName: string;
  logo: string;
  chain?: string;
}

export interface ConnectedAccount {
  owner: string;
  subaccount?: number[];
}