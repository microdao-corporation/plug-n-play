<script lang="ts">
  interface Props {
    class?: string;
  }

  let { class: className = '', children }: Props = $props();
</script>

<div class="card {className}">
  {@render children?.()}
</div>

<style>
  .card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
</style>