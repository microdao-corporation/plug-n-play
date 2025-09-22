<script lang="ts">
  import { onMount } from 'svelte';
  import ErrorMessage from '../ui/ErrorMessage.svelte';
  import { CommentsService } from '../../services/comments.service';
  import type { CommentResponse } from '../../idls/comments/comments.did';

  interface Props {
    principalId: string | null;
    isConnected: boolean;
  }

  const { principalId = null, isConnected = false }: Props = $props();

  let contextId = $state('comments-market:65');
  let content = $state('');
  let comments = $state<CommentResponse[]>([]);
  let nextCursor = $state<bigint | null>(null);
  let loading = $state(false);
  let submitting = $state(false);
  let error = $state<string | null>(null);
  let success = $state<string | null>(null);

  function resetStatus() {
    error = null;
    success = null;
  }

  async function loadComments(reset = false) {
    if (!contextId.trim()) {
      error = 'Please enter a context ID.';
      return;
    }

    loading = true;
    if (reset) {
      comments = [];
      nextCursor = null;
    }
    resetStatus();

    try {
      const response = await CommentsService.fetchComments(
        contextId.trim(),
        principalId ?? undefined,
        nextCursor ? { limit: 5, cursor: nextCursor } : { limit: 5 }
      );

      if (reset || !nextCursor) {
        comments = response.comments;
      } else {
        comments = [...comments, ...response.comments];
      }

      nextCursor = response.next_cursor?.[0] ?? null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load comments.';
    } finally {
      loading = false;
    }
  }

  async function loadMore() {
    if (!nextCursor) return;
    await loadComments();
  }

  async function refreshComments() {
    nextCursor = null;
    await loadComments(true);
  }

  async function handleSubmit() {
    if (!isConnected) {
      error = 'Connect a wallet before creating comments.';
      return;
    }

    if (!contextId.trim()) {
      error = 'Please enter a context ID.';
      return;
    }

    if (!content.trim()) {
      error = 'Comment content cannot be empty.';
      return;
    }

    submitting = true;
    resetStatus();

    try {
      const created = await CommentsService.createComment(
        contextId.trim(),
        content.trim()
      );

      comments = [created, ...comments];
      content = '';
      success = 'Comment submitted successfully.';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to submit comment.';
    } finally {
      submitting = false;
    }
  }

  function formatTimestamp(value: bigint): string {
    try {
      const ms = Number(value / 1_000_000n);
      if (!Number.isFinite(ms)) return value.toString();
      return new Date(ms).toLocaleString();
    } catch (err) {
      return value.toString();
    }
  }

  function formatPrincipal(principal: CommentResponse['author']): string {
    const text = (principal as any)?.toText?.();
    return text || String(principal);
  }

  onMount(() => {
    void refreshComments();
  });
</script>

<div class="comments">
  <h3>Comments Example</h3>
  <p class="description">
    Interact with the comments canister&nbsp;
    <code>oeluz-4iaaa-aaaao-a4lxq-cai</code>.
  </p>

  <label class="field">
    <span>Context ID</span>
    <input
      type="text"
      bind:value={contextId}
      placeholder="comments-market:65"
      oninput={resetStatus}
    />
  </label>

  <label class="field">
    <span>Comment</span>
    <textarea
      bind:value={content}
      placeholder="Leave a short note for this context"
      rows={3}
      oninput={resetStatus}
    ></textarea>
  </label>

  <div class="actions">
    <button class="primary" onclick={handleSubmit} disabled={submitting}>
      {submitting ? 'Submitting…' : 'Create Comment'}
    </button>
    <button class="secondary" onclick={refreshComments} disabled={loading}>
      {loading ? 'Loading…' : 'Refresh'}
    </button>
  </div>

  {#if success}
    <div class="success">{success}</div>
  {/if}

  <ErrorMessage message={error} />

  <div class="list">
    {#if comments.length === 0 && !loading}
      <p class="empty">No comments found for this context yet.</p>
    {:else}
      {#each comments as comment (comment.id.toString())}
        <div class="comment">
          <div class="comment-header">
            <span class="author">{formatPrincipal(comment.author)}</span>
            <span class="timestamp">{formatTimestamp(comment.created_at)}</span>
          </div>
          <p class="content">{comment.content}</p>
          <div class="meta">
            <span>ID: {comment.id.toString()}</span>
            <span>Likes: {comment.likes}</span>
            {#if comment.parent_id.length}
              <span>Parent: {comment.parent_id[0].toString()}</span>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>

  {#if nextCursor}
    <button class="load-more" onclick={loadMore} disabled={loading}>
      {loading ? 'Loading…' : 'Load more'}
    </button>
  {/if}
</div>

<style>
  .comments {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .description {
    margin: 0;
    color: #4a5568;
    font-size: 0.9rem;
  }

  .description code {
    background: #edf2f7;
    border-radius: 4px;
    padding: 0 0.25rem;
    font-size: 0.85rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field span {
    font-weight: 600;
    color: #2d3748;
  }

  input,
  textarea {
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.15s ease;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.25);
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  button {
    cursor: pointer;
    border-radius: 999px;
    padding: 0.5rem 1.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .primary {
    background: #3182ce;
    color: white;
  }

  .secondary,
  .load-more {
    background: #edf2f7;
    color: #2d3748;
  }

  .success {
    background: #f0fff4;
    border: 1px solid #9ae6b4;
    color: #276749;
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 0.9rem;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .comment {
    background: #f7fafc;
    border-radius: 10px;
    padding: 1rem;
    border: 1px solid #e2e8f0;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.85rem;
    color: #4a5568;
    flex-wrap: wrap;
  }

  .author {
    font-weight: 600;
  }

  .content {
    margin: 0.75rem 0;
    color: #2d3748;
    line-height: 1.4;
  }

  .meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: #718096;
  }

  .empty {
    margin: 0;
    color: #718096;
    font-size: 0.9rem;
  }

  .load-more {
    align-self: center;
  }
</style>
