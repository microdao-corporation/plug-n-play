<script lang="ts">
  import { useWallet } from '../composables/useWallet.svelte';
  import { useLedger } from '../composables/useLedger.svelte';
  import Card from './ui/Card.svelte';
  import ErrorMessage from './ui/ErrorMessage.svelte';
  import WalletButton from './wallet/WalletButton.svelte';
  import ConnectedWallet from './wallet/ConnectedWallet.svelte';
  import CommentExample from './comments/CommentExample.svelte';

  // Create state instances within the component
  const wallet = useWallet();
  const ledger = useLedger();

  // Auto-reconnect on mount
  $effect(() => {
    wallet.autoReconnect();
  });

  // Effect to fetch balance when connected
  $effect(() => {
    if (wallet.isConnected && wallet.principalId) {
      ledger.fetchBalance(wallet.principalId);
    } else {
      ledger.reset();
    }
  });

  async function handleConnect(walletId: string) {
    wallet.clearError();
    try {
      await wallet.connect(walletId);
    } catch (e) {
      // Error is already handled in the composable
    }
  }
</script>

<div class="container">
  {#if wallet.isConnected}
    <Card>
      <ConnectedWallet
        principalId={wallet.principalId || ''}
        balance={ledger.formattedBalance}
        ondisconnect={wallet.disconnect}
        onbalanceupdate={() => ledger.fetchBalance(wallet.principalId)}
      />
    </Card>
    <Card>
      <CommentExample
        principalId={wallet.principalId}
        isConnected={wallet.isConnected}
      />
    </Card>
  {:else}
    <Card>
      <h2>Connect Wallet</h2>
      <div class="wallets">
        {#each wallet.availableWallets as w}
          <WalletButton
            wallet={w}
            isConnecting={wallet.connectingWalletId === w.id}
            onclick={() => handleConnect(w.id)}
          />
        {/each}
      </div>
      <ErrorMessage message={wallet.error} />
    </Card>
  {/if}

  {#if wallet.lastEvent}
    <Card class="events">
      <h3>Latest Event</h3>
      <pre>{JSON.stringify(wallet.lastEvent, null, 2)}</pre>
    </Card>
  {/if}

  {#if ledger.error}
    <Card>
      <h3>Ledger Error</h3>
      <ErrorMessage message={ledger.error} />
    </Card>
  {/if}
</div>

<style>
  .container {
    max-width: 480px;
    margin: 0 auto;
    padding: 2rem;
  }

  h2, h3 {
    margin: 0 0 1rem;
    color: #1a202c;
  }

  .wallets {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  :global(.events) pre {
    background: #f7fafc;
    border-radius: 8px;
    padding: 1rem;
    font-size: 0.75rem;
    max-height: 200px;
    overflow-y: auto;
    margin: 0;
  }
</style>
