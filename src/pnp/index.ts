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

class PnP {
  state: {
    account: Wallet.Account | null;
    activeWallet: string | null;
    provider: Adapter.Interface | null;
    canisterActors: Record<string, ActorSubclass<any>>;
    anonCanisterActors: Record<string, ActorSubclass<any>>;
    config: Wallet.PnPConfig;
    callbacks: Wallet.WalletEventCallback[];
  };

  constructor(config: Wallet.PnPConfig = {}) {
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
        ...config,
      },
      callbacks: [],
    };
  }

  getAccountId(): string | null {
    if (!this.state.provider) return null;
    const principalId = this.state.account?.owner?.toString() || "";
    const id = getAccountIdentifier(principalId);
    return id || null;
  }

  getPrincipalId(): Principal | null {
    return this.state.provider ? this.state.account!.owner : null;
  }

  async connect(walletId: string): Promise<Wallet.Account> {
    const selectedWallet = walletsList.find((w) => w.id === walletId);
    if (!selectedWallet) throw new Error("Selected wallet not found");

    const walletInstance = new selectedWallet.adapter();
    if (!(await walletInstance.isAvailable())) {
      window.open(walletInstance.url, "_blank");
      throw new Error("Wallet not available");
    }

    const connectionResult = await walletInstance.connect(this.state.config);
    if (!connectionResult || typeof connectionResult === "boolean") {
      throw new Error("Error connecting to wallet");
    }

    this.state = {
      ...this.state,
      account: connectionResult,
      activeWallet: walletId,
      provider: walletInstance,
    };

    localStorage.setItem(this.state.config.localStorageKey, walletId);
    
    return connectionResult;
  }

  async disconnect(): Promise<void> {
    if (this.state.provider) await this.state.provider.disconnect();
    localStorage.removeItem(this.state.config.localStorageKey);
    this.state = {
      ...this.state,
      account: null,
      activeWallet: null,
      provider: null,
      canisterActors: {},
      anonCanisterActors: {},
    };
  }

  async icrc1BalanceOf(canisterId: string, account: Wallet.Account): Promise<BigInt> {
    if (!this.state.provider) throw new Error("Wallet not connected");
    return await this.state.provider.icrc1BalanceOf(canisterId, account);
  }

  async icrc1Transfer(canisterId: Principal, params: Wallet.TransferParams): Promise<any> {
    if (!this.state.provider) throw new Error("Wallet not connected");
    return await this.state.provider.icrc1Transfer(canisterId, params);
  }

  async icrc1Metadata(canisterId: string): Promise<any> {
    if (!this.state.provider) throw new Error("Wallet not connected");
    const actor = await this.state.provider.createActor(canisterId, ICRC1_IDL);
    // @ts-ignore
    return await actor.icrc1_metadata();
  }

  async getSignedActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>> {
    if (!this.state.provider) throw new Error("Wallet not connected");
    try {
      return await this.state.provider.createActor<T>(canisterId, idl);
    } catch (error) {
      console.error("Error creating signed actor:", error);
      throw error;
    }
  }

  async getCanisterActor<T>(
    canisterId: string,
    idl: any,
    isAnon: boolean = false,
    isForced: boolean = false,
    isSigned: boolean = false
  ): Promise<ActorSubclass<T>> {
    if (isSigned) return this.getSignedActor(canisterId, idl);

    if (isAnon) {
      if (isForced || !this.state.anonCanisterActors[canisterId]) {
        const pubAgent = HttpAgent.createSync({
          identity: new AnonymousIdentity(),
          host: this.state.config.hostUrl,
        });
        if (this.state.config.hostUrl?.includes("localhost")) {
          await pubAgent.fetchRootKey();
        }
        const actor = this.state.provider.createActor<T>(idl, {
          canisterId,
          idl
        });
        this.state.anonCanisterActors[canisterId] = actor;
        return actor;
      } else {
        return this.state.anonCanisterActors[canisterId] as ActorSubclass<T>;
      }
    } else {
      if (!this.state.provider) throw new Error("Wallet not connected");
      if (isForced || !this.state.canisterActors[canisterId]) {
        const actor = await this.state.provider.createActor<T>(canisterId, idl);
        this.state.canisterActors[canisterId] = actor;
        return actor;
      } else {
        return this.state.canisterActors[canisterId] as ActorSubclass<T>;
      }
    }
  }

  createAgent(options?: { whitelist: string[]; host?: string }): Promise<void> {
    if (options?.host){
      this.state.config.hostUrl = options.host;
    } else {
      options = { whitelist: this.state.config.whitelist, host: this.state.config.hostUrl };
    }
    if (!this.state.provider) throw new Error("Wallet not connected");
    return this.state.provider.createAgent(options);
  }

  isWalletConnected(): boolean {
    return !!this.state.activeWallet;
  }

  activeWallet(): string | null {
    return this.state.activeWallet;
  }

  registerCallback(callback: Wallet.WalletEventCallback): void {
    this.state.callbacks.push(callback);
  }
}

export const walletsList = walletList;
export const createPnP = (config: Wallet.PnPConfig = {}) => new PnP(config);