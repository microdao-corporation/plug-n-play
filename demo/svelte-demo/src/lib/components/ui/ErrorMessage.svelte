<script lang="ts">
  interface Props {
    message: string | null;
  }

  let { message }: Props = $props();
</script>

{#if message}
  <div class="error">
    {message}
  </div>
{/if}

<style>
  .error {
    margin-top: 1rem;
    padding: 0.75rem;
    background: #fff5f5;
    border: 1px solid #feb2b2;
    border-radius: 6px;
    color: #c53030;
    font-size: 0.875rem;
  }
</style>