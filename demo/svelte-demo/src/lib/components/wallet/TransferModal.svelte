<script lang="ts">
  import { LedgerService } from '../../services/ledger.service';

  interface Props {
    isOpen: boolean;
    onclose: () => void;
    onsuccess: (txId: bigint) => void;
  }

  let { isOpen, onclose, onsuccess }: Props = $props();

  let recipient = $state('');
  let amount = $state('');
  let isTransferring = $state(false);
  let error = $state<string | null>(null);

  // Computed values
  const fee = $derived(LedgerService.formatICP(LedgerService.transferFee));
  const isValidForm = $derived(() => {
    try {
      if (!recipient || !amount) return false;
      // Validate principal
      const principal = Principal.fromText(recipient);
      // Validate amount
      const amountBigInt = LedgerService.parseICP(amount);
      return amountBigInt > 0n;
    } catch {
      return false;
    }
  });

  async function handleTransfer() {
    if (!isValidForm()) return;

    error = null;
    isTransferring = true;

    try {
      const amountE8s = LedgerService.parseICP(amount);
      const txId = await LedgerService.transfer(recipient, amountE8s);

      // Reset form
      recipient = '';
      amount = '';

      // Notify parent
      onsuccess(txId);
      onclose();
    } catch (err) {
      console.error('Transfer error:', err);
      if (err instanceof Error) {
        // Check for specific error types
        if (err.message.includes('ingress_expiry')) {
          error = 'Authentication expired. Please reconnect your wallet.';
        } else if (err.message.includes('InsufficientFunds')) {
          error = 'Insufficient funds for this transfer (including fee).';
        } else {
          error = err.message;
        }
      } else {
        error = 'Transfer failed. Please try again.';
      }
    } finally {
      isTransferring = false;
    }
  }

  function handleClose() {
    if (!isTransferring) {
      recipient = '';
      amount = '';
      error = null;
      onclose();
    }
  }

  // Import Principal for validation
  import { Principal } from '@dfinity/principal';
</script>

{#if isOpen}
  <div class="modal-overlay" onclick={handleClose} onkeydown={(e) => e.key === 'Escape' && handleClose()} role="button" tabindex="0" aria-label="Close modal">
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>Send ICP</h3>
        <button class="close-btn" onclick={handleClose} disabled={isTransferring}>
          ×
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="recipient">Recipient Principal ID</label>
          <input
            id="recipient"
            type="text"
            bind:value={recipient}
            placeholder="Enter principal ID"
            disabled={isTransferring}
          />
        </div>

        <div class="form-group">
          <label for="amount">Amount (ICP)</label>
          <input
            id="amount"
            type="text"
            bind:value={amount}
            placeholder="0.00"
            disabled={isTransferring}
          />
          <div class="fee-info">
            Transaction fee: {fee} ICP
          </div>
        </div>

        {#if error}
          <div class="error-message">
            {error}
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <button
          class="btn-cancel"
          onclick={handleClose}
          disabled={isTransferring}
        >
          Cancel
        </button>
        <button
          class="btn-transfer"
          onclick={handleTransfer}
          disabled={!isValidForm() || isTransferring}
        >
          {#if isTransferring}
            <span class="spinner">⟳</span> Sending...
          {:else}
            Send ICP
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 0;
    cursor: default;
  }

  .modal {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 480px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1a202c;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #718096;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .close-btn:hover:not(:disabled) {
    background: #f7fafc;
    color: #2d3748;
  }

  .close-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  .form-group input:disabled {
    background: #f7fafc;
    opacity: 0.6;
    cursor: not-allowed;
  }

  .fee-info {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #718096;
  }

  .error-message {
    padding: 0.75rem;
    background: #fff5f5;
    border: 1px solid #feb2b2;
    border-radius: 6px;
    color: #c53030;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1.5rem;
    border-top: 1px solid #e2e8f0;
  }

  .btn-cancel,
  .btn-transfer {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
  }

  .btn-cancel {
    background: #f7fafc;
    color: #4a5568;
    border-color: #e2e8f0;
  }

  .btn-cancel:hover:not(:disabled) {
    background: #edf2f7;
    border-color: #cbd5e0;
  }

  .btn-transfer {
    background: #4299e1;
    color: white;
  }

  .btn-transfer:hover:not(:disabled) {
    background: #3182ce;
  }

  .btn-transfer:disabled,
  .btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinner {
    animation: spin 1s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>