// src/adapters/BaseSiwxAdapter.ts

import { Ed25519KeyIdentity, Delegation, DelegationChain, DelegationIdentity } from "@icp-sdk/core/identity";
import { type ActorSubclass, type Identity } from "@icp-sdk/core/agent";
import { BaseDelegationAdapter } from "./BaseDelegationAdapter";

/**
 * Base adapter for SIW* (Sign-In with X) flows that rely on delegation identities.
 * Provides shared helpers for provider actor creation, delegation identity building,
 * and simple address storage utilities.
 */
export abstract class BaseSiwxAdapter<TConfig = any> extends BaseDelegationAdapter<TConfig> {
  /** Resolve provider canister ID from multiple possible keys for backwards compatibility */
  protected resolveProviderCanisterId(): string {
    const cfg: any = this.config as any;
    const canisterId = cfg.providerCanisterId || cfg.siwsProviderCanisterId || cfg.siweProviderCanisterId;
    if (!canisterId) {
      throw new Error("Provider canister ID not configured.");
    }
    return String(canisterId);
  }

  /** Create a provider actor using the standard agent settings from base config */
  protected async createProviderActor<T>(idlFactory: any, identity?: Identity): Promise<ActorSubclass<T>> {
    const agent = await this.buildHttpAgent({ identity });
    return this.createActorWithAgent<T>(agent, this.resolveProviderCanisterId(), idlFactory);
  }

  /**
   * Build a DelegationIdentity from a signed delegation returned by a provider
   */
  protected createDelegationIdentity(
    signedDelegation: any,
    sessionIdentity: Ed25519KeyIdentity,
    userCanisterPublicKeyDer: ArrayBuffer | Uint8Array,
  ): DelegationIdentity {
    const pubkeyBytes = signedDelegation.delegation.pubkey instanceof Uint8Array
      ? signedDelegation.delegation.pubkey
      : new Uint8Array(signedDelegation.delegation.pubkey);

    const delegation = new Delegation(
      pubkeyBytes,
      signedDelegation.delegation.expiration,
      signedDelegation.delegation.targets?.length > 0
        ? signedDelegation.delegation.targets[0]
        : undefined,
    );

    const signatureBytes = signedDelegation.signature instanceof Uint8Array
      ? signedDelegation.signature
      : new Uint8Array(signedDelegation.signature);

    const delegations = [
      {
        delegation,
        signature: signatureBytes,
      },
    ];

    const publicKeyBytes = userCanisterPublicKeyDer instanceof Uint8Array
      ? userCanisterPublicKeyDer
      : new Uint8Array(userCanisterPublicKeyDer);

    const delegationChain = DelegationChain.fromDelegations(
      delegations,
      publicKeyBytes,
    );

    return DelegationIdentity.fromDelegation(sessionIdentity, delegationChain);
  }

  // ----- Simple address storage helpers -----
  protected async storeExternalAddress(key: string, value: string): Promise<void> {
    try {
      await this.storage.set(key, value);
    } catch {
      // best-effort
    }
  }

  protected async readExternalAddress(key: string): Promise<string | null> {
    try {
      const val = await this.storage.get(key);
      return typeof val === 'string' ? val : null;
    } catch {
      return null;
    }
  }

  // Provide default no-op implementations so subclasses override only when needed
  protected async onStorageRestored(_sessionKey: Ed25519KeyIdentity, _delegationChain: DelegationChain): Promise<void> {
    /* no-op by default */
  }

  protected async onClearStoredSession(): Promise<void> {
    /* no-op by default */
  }
}


