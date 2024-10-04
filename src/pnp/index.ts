import type { Adapter, Wallet } from "../types/index";
import {
  Actor,
  HttpAgent,
  type ActorSubclass,
  AnonymousIdentity,
} from "@dfinity/agent";
import { walletList } from "../adapters";
import { Principal } from "@dfinity/principal";
import { getAccountIdentifier } from "../utils/identifierUtils";
import { ICRC1_IDL } from "../did/icrc1.idl.js";

class PNP {
  state: {
    account: Wallet.Account | null;
    activeWallet: string | null;
    provider: Adapter.Interface | null;
    canisterActors: Record<string, ActorSubclass<any>>;
    anonCanisterActors: Record<string, ActorSubclass<any>>;
    config: Wallet.PNPConfig;
  };

  constructor(config: Wallet.PNPConfig = {}) {
    this.state = {
      account: null,
      activeWallet: null,
      provider: null,
      canisterActors: {},
      anonCanisterActors: {},
      config: {
        hostUrl: config.hostUrl || "http://localhost:4943",
        localStorageKey: config.localStorageKey || "pnpConnectedWallet",
        identityProvider: config.identityProvider,
        timeout: config.timeout || 1000 * 60 * 60 * 24 * 7, // 7 days
        ...config,
      },
    };
  }

  getAccountId(): string | null {
    if (!this.state.provider || !this.state.account) return null;
    const principalId = this.state.account.owner.toString();
    return getAccountIdentifier(principalId) || null;
  }

  getPrincipalId(): Principal | null {
    return this.state.provider && this.state.account
      ? this.state.account.owner
      : null;
  }

  async connect(walletId: string): Promise<Wallet.Account> {
    const selectedWallet = walletsList.find((w) => w.id === walletId);
    if (!selectedWallet)
      throw new Error(`Wallet with ID "${walletId}" not found.`);

    const walletInstance = new selectedWallet.adapter();
    const isAvailable = await walletInstance.isAvailable();

    if (!isAvailable) {
      throw new Error(
        `Wallet "${walletId}" is not available. Please install or enable it.`
      );
    }

    const connectionResult = await walletInstance.connect(this.state.config);
    if (!connectionResult || typeof connectionResult === "boolean") {
      throw new Error(`Failed to connect to wallet "${walletId}".`);
    }

    this.state.account = connectionResult;
    this.state.activeWallet = walletId;
    this.state.provider = walletInstance;

    localStorage.setItem(this.state.config.localStorageKey, walletId);
    return connectionResult;
  }

  async disconnect(): Promise<void> {
    if (this.state.provider) await this.state.provider.disconnect();
    localStorage.removeItem(this.state.config.localStorageKey);
    this.state.account = null;
    this.state.activeWallet = null;
    this.state.provider = null;
    this.state.canisterActors = {};
    this.state.anonCanisterActors = {};
  }

  async callCanister<T>(
    canisterId: string,
    methodName: string,
    args: any[] = [],
    idl?: any,
    options?: {
      isAnon?: boolean;
      isSigned?: boolean;
    }
  ): Promise<T> {
    const { isAnon = false, isSigned = false } = options || {};

    if (!this.state.provider && !isAnon) {
      throw new Error("Wallet not connected");
    }

    try {
      const actor = await this.getActor(canisterId, idl || ICRC1_IDL, {
        isAnon,
        isSigned,
      });

      if (typeof actor[methodName] !== "function") {
        throw new Error(
          `Method "${methodName}" not found on canister "${canisterId}"`
        );
      }

      return await actor[methodName](...args);
    } catch (error) {
      console.error(
        `Error calling method "${methodName}" on canister "${canisterId}":`,
        error
      );
      throw error;
    }
  }

  async getActor<T>(
    canisterId: string,
    idl: any,
    options?: {
      isAnon?: boolean;
      isForced?: boolean;
      isSigned?: boolean;
    }
  ): Promise<ActorSubclass<T>> {
    const { isAnon = false, isForced = false, isSigned = false } = options || {};

    if (isSigned) {
      return this.createSignedActor<T>(canisterId, idl);
    }

    const actorCache = isAnon
      ? this.state.anonCanisterActors
      : this.state.canisterActors;
    if (!isForced && actorCache[canisterId]) {
      return actorCache[canisterId] as ActorSubclass<T>;
    }

    const actor = isAnon
      ? await this.createAnonymousActor<T>(canisterId, idl)
      : await this.createSignedActor<T>(canisterId, idl);

    actorCache[canisterId] = actor;
    return actor;
  }

  private async createAnonymousActor<T>(
    canisterId: string,
    idl: any
  ): Promise<ActorSubclass<T>> {
    const agent = await HttpAgent.create({
      identity: new AnonymousIdentity(),
      host: this.state.config.hostUrl,
    });
    if (this.state.config.hostUrl?.includes("localhost")) {
      await agent.fetchRootKey();
    }
    return Actor.createActor<T>(idl, { agent, canisterId });
  }

  private async createSignedActor<T>(
    canisterId: string,
    idl: any
  ): Promise<ActorSubclass<T>> {
    if (!this.state.provider) throw new Error("Wallet not connected");
    return this.state.provider.createActor<T>(canisterId, idl);
  }

  isWalletConnected(): boolean {
    return !!this.state.activeWallet;
  }

  activeWallet(): Wallet.Account | null {
    return this.state.account;
  }
}

export const walletsList = walletList;
export const createPNP = (config: Wallet.PNPConfig = {}) => new PNP(config);