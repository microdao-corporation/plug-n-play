<script lang="ts">
  import type { WalletInfo } from '../../types/wallet.types';

  interface Props {
    wallet: WalletInfo;
    isConnecting: boolean;
    onclick: () => void;
  }

  let { wallet, isConnecting, onclick }: Props = $props();
</script>

<button
  class="wallet-btn"
  disabled={isConnecting}
  {onclick}
>
  <div class="wallet-info">
    <img src={wallet.logo} alt={wallet.walletName} />
    <span>{wallet.walletName}</span>
    {#if wallet.chain}
      <span class="chain-badge chain-{wallet.chain.toLowerCase()}">{wallet.chain}</span>
    {/if}
  </div>
  {#if isConnecting}
    <span class="spinner">⟳</span>
  {/if}
</button>

<style>
  .wallet-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
  }

  .wallet-btn:hover:not(:disabled) {
    background: #edf2f7;
    border-color: #cbd5e0;
  }

  .wallet-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .wallet-btn img {
    width: 24px;
    height: 24px;
  }

  .wallet-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }

  .wallet-info span {
    color: #2d3748;
    font-weight: 500;
  }

  .chain-badge {
    margin-left: auto;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .chain-icp {
    background: #e6f3ff;
    color: #0074e4;
  }

  .chain-sol {
    background: #f0e6ff;
    color: #9945ff;
  }

  .chain-eth {
    background: #f5f5ff;
    color: #627eea;
  }

  .spinner {
    animation: spin 1s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>