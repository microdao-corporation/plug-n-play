import { Principal } from '@dfinity/principal';
import { idlFactory } from '../idls/comments';
import type {
  _SERVICE,
  CommentResponse,
  CommentsPage,
} from '../idls/comments/comments.did';
import { PNPService } from './pnp.service';

const COMMENTS_CANISTER_ID = 'oeluz-4iaaa-aaaao-a4lxq-cai';

export class CommentsService {
  private static getPNP() {
    return PNPService.getInstance() ?? PNPService.initialize();
  }

  private static getProvider(pnp: ReturnType<typeof PNPService.initialize>) {
    return (pnp as any).connectionManager?.provider;
  }

  private static getAnonymousActor(): _SERVICE {
    const pnp = this.getPNP();
    return pnp.getActor<_SERVICE>({
      canisterId: COMMENTS_CANISTER_ID,
      idl: idlFactory,
      anon: true,
    });
  }

  private static getAuthenticatedActor(): _SERVICE {
    const pnp = this.getPNP();

    if (!pnp.isAuthenticated()) {
      throw new Error('Please connect your wallet to interact with comments.');
    }

    return pnp.getActor<_SERVICE>({
      canisterId: COMMENTS_CANISTER_ID,
      idl: idlFactory,
      anon: false,
    });
  }

  static async fetchComments(
    contextId: string,
    principalId?: string,
    options?: { limit?: number; cursor?: bigint }
  ): Promise<CommentsPage> {
    const actor = this.getAnonymousActor();

    const limit = options?.limit ?? 5;
    const pagination = [{
      limit: [BigInt(limit)],
      cursor: options?.cursor ? [options.cursor] : [],
    }];

    const response = await actor.get_comments_by_context({
      context_id: contextId,
      pagination,
      check_likes_for: principalId ? [Principal.fromText(principalId)] : [],
    });

    return response;
  }

  static async createComment(
    contextId: string,
    content: string,
    parentId?: bigint
  ): Promise<CommentResponse> {
    if (!content.trim()) {
      throw new Error('Comment content cannot be empty.');
    }

    const actor = this.getAuthenticatedActor();

    const result = await actor.create_comment({
      context_id: contextId,
      content,
      parent_id: parentId ? [parentId] : [],
    });

    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok;
  }
}
