import { Wallet } from "../types";
import { Actor, HttpAgent, ActorSubclass, AnonymousIdentity } from "@dfinity/agent";
import { walletList } from "./adapters";

class PnP {
  private account: Wallet.Account | null = null;
  private activeWallet: string | null = null;
  private provider: Wallet.AdapterInterface | null = null;
  private balance: number = 0;
  private canisterActors: Record<string, ActorSubclass<any>> = {};
  private anonCanisterActors: Record<string, ActorSubclass<any>> = {};
  private wallets: Array<Wallet.AdapterInfo & { adapter: Wallet.AdapterConstructor }>;
  private config: Wallet.PnPConfig;
  private walletState: Wallet.WalletState = {
    account: null,
    activeWallet: null,
    exeBalance: 0,
    icpBalance: 0,
  };

  private callbacks: Wallet.WalletEventCallback[] = [];

  constructor(config: Wallet.PnPConfig = {}) {
    this.wallets = walletList.map((wallet) => ({
      id: wallet.id,
      adapter: wallet.adapter as Wallet.AdapterConstructor,
      icon: wallet.icon,
      name: wallet.name,
    }));
    this.config = {
      hostUrl: config.hostUrl || "http://localhost:4943",
      localStorageKey: config.localStorageKey || "connectedWallet",
      defaultCanisterId: config.defaultCanisterId || "",
      identityProvider: config.identityProvider,
      ...config,
    };

    this._initializeFromLocalStorage();
  }

  private async _initializeFromLocalStorage(): Promise<void> {
    const connectedWallet = localStorage.getItem(this.config.localStorageKey || "");
    if (connectedWallet) {
      await this.connect(connectedWallet);
    }
  }

  registerCallback(callback: Wallet.WalletEventCallback): void {
    this.callbacks.push(callback);
  }

  private triggerCallbacks() {
    for (const callback of this.callbacks) {
      callback(this.walletState);
    }
  }

  async connect(walletId: string, connectObj: Wallet.PnPConfig = {}): Promise<string | false> {
    const selectedWallet = this.wallets.find((w) => w.id === walletId);
    if (!selectedWallet) return false;

    try {
      const walletInstance = new selectedWallet.adapter();
      if (await walletInstance.isAvailable()) {
        const connectionResult = await walletInstance.connect({
          ...this.config,
          ...connectObj,
        });

        if (connectionResult && typeof connectionResult !== 'boolean') {
          this.account = connectionResult;
          this.activeWallet = walletId;
          this.provider = walletInstance;

          localStorage.setItem(this.config.localStorageKey || "", this.activeWallet);
          this._dispatchWalletConnectedEvent(walletId);
          await this.getWalletBalance();
          this.walletState = {
            account: this.account,
            activeWallet: this.activeWallet,
            exeBalance: this.balance,
            icpBalance: 0,
          };
          
          // Trigger the callbacks after updating the state
          this.triggerCallbacks();
          
          return this.account.principalId;
        }
      } else {
        window.open(walletInstance.url, "_blank");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
    return false;
  }

  async disconnect(): Promise<boolean> {
    if (this.provider) {
      await this.provider.disconnect();
    }
    localStorage.removeItem(this.config.localStorageKey || "");
    this.provider = null;
    this.account = null;
    this.activeWallet = null;

    this.walletState = {
      account: null,
      activeWallet: null,
      exeBalance: 0,
      icpBalance: 0,
    };
    this.triggerCallbacks();

    return true;
  }

  async getWalletBalance(): Promise<number> {
    return 0;
  }

  async getSignedActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>> {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    try {
      const actor = await this.provider.createActor<T>(canisterId, idl);
      return actor as ActorSubclass<T>;
    } catch (error) {
      console.error(
        `Error creating signed actor for canister ${canisterId}:`,
        error
      );
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
    if (isSigned) {
      return this.getSignedActor<T>(canisterId, idl);
    }

    let actor: ActorSubclass<T>;

    if (isAnon) {
      if (isForced || !this.anonCanisterActors[canisterId]) {
        const pubAgent = HttpAgent.createSync({
          identity: new AnonymousIdentity(),
          host: this.config.hostUrl,
        });
        if (this.config.hostUrl?.includes("localhost")) {
          await pubAgent.fetchRootKey();
        }
        actor = Actor.createActor<T>(idl, {
          agent: pubAgent,
          canisterId: canisterId,
        });
        this.anonCanisterActors[canisterId] = actor;
      } else {
        actor = this.anonCanisterActors[canisterId] as ActorSubclass<T>;
      }
    } else {
      if (!this.provider) {
        throw new Error("Wallet not connected");
      }
      if (isForced || !this.canisterActors[canisterId]) {
        const createdActor = await this.provider.createActor<T>(canisterId, idl);
        actor = createdActor as ActorSubclass<T>;
        this.canisterActors[canisterId] = actor;
      } else {
        actor = this.canisterActors[canisterId] as ActorSubclass<T>;
      }
    }

    return actor;
  }


  async transfer(params: any): Promise<any> {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }
    return this.provider.transfer(params);
  }

  isWalletConnected(): boolean {
    return !!this.activeWallet;
  }

  private _dispatchWalletConnectedEvent(walletId: string): void {
    const event = new CustomEvent("walletConnected", { detail: { walletId } });
    window.dispatchEvent(event);
  }
}

export default PnP;
