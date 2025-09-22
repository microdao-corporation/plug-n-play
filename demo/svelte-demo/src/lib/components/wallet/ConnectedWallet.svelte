<script lang="ts">
  import TransferModal from './TransferModal.svelte';

  interface Props {
    principalId: string;
    balance: string;
    ondisconnect: () => void;
    onbalanceupdate?: () => void;
  }

  let { principalId, balance, ondisconnect, onbalanceupdate }: Props = $props();

  let showTransferModal = $state(false);
  let lastTxId = $state<bigint | null>(null);

  function handleTransferSuccess(txId: bigint) {
    lastTxId = txId;
    // Refresh balance after successful transfer
    if (onbalanceupdate) {
      setTimeout(() => onbalanceupdate(), 2000);
    }
  }
</script>

<div class="connected-wallet">
  <div class="status">✅ Connected</div>

  <div class="info">
    <div class="label">Principal ID</div>
    <code>{principalId}</code>
  </div>

  <div class="info">
    <div class="label">ICP Balance</div>
    <code>{balance} ICP</code>
  </div>

  <div class="note">
    💡 <strong>Tip:</strong> If using Plug wallet with multiple accounts, you can select which account to use during connection.
  </div>

  {#if lastTxId}
    <div class="success-message">
      ✅ Transfer successful! Transaction ID: {lastTxId}
    </div>
  {/if}

  <div class="button-group">
    <button class="btn-send" onclick={() => showTransferModal = true}>
      💸 Send ICP
    </button>
    <button class="btn-disconnect" onclick={ondisconnect}>
      Disconnect
    </button>
  </div>
</div>

<TransferModal
  isOpen={showTransferModal}
  onclose={() => showTransferModal = false}
  onsuccess={handleTransferSuccess}
/>

<style>
  .connected-wallet {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .status {
    color: #2f855a;
    font-weight: 600;
  }

  .info {
    background: #f7fafc;
    border-radius: 8px;
    padding: 1rem;
  }

  .info .label {
    display: block;
    font-size: 0.875rem;
    color: #4a5568;
    margin-bottom: 0.5rem;
  }

  code {
    font-family: monospace;
    word-break: break-all;
    color: #2d3748;
  }

  .note {
    padding: 0.75rem;
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 6px;
    color: #0050b3;
    font-size: 0.875rem;
  }

  .note strong {
    font-weight: 600;
  }

  .success-message {
    padding: 0.75rem;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 6px;
    color: #166534;
    font-size: 0.875rem;
    word-break: break-all;
  }

  .button-group {
    display: flex;
    gap: 0.75rem;
  }

  .btn-send,
  .btn-disconnect {
    flex: 1;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
    font-weight: 500;
  }

  .btn-send {
    background: #4299e1;
    color: white;
    border-color: #3182ce;
  }

  .btn-send:hover {
    background: #3182ce;
  }

  .btn-disconnect {
    background: #fff5f5;
    border: 1px solid #feb2b2;
    color: #c53030;
  }

  .btn-disconnect:hover {
    background: #fed7d7;
  }
</style>