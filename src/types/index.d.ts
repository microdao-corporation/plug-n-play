// Adapters
import { NNSAdapter } from "./src/adapters/NNSAdapter";
import { PlugAdapter } from "./src/adapters/PlugAdapter";
import { BitfinityAdapter } from "./src/adapters/BitfinityAdapter";
import { BatchTransact } from "./src/utils/batchTransact";
import { AnonymousIdentity, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { ActorSubclass } from "@dfinity/agent";
import { P } from "vitest/dist/chunks/environment.0M5R1SX_";

declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

export namespace Wallet {
  export interface PnPConfig {
    hostUrl?: string;
    localStorageKey?: string;
    defaultCanisterId?: string;
    identityProvider?: string;
    [key: string]: any;
  }

  export interface PnPWindow {
    BatchTransact: typeof BatchTransact;
    nns: {
      AnonymousIdentity: typeof AnonymousIdentity;
      Principal: typeof Principal;
    };
  }

  export interface Account {
    subaccount: Uint8Array | null;
    owner: Principal | null;
  }

  export type ConnectionResult = Account;

  export interface AdapterInfo {
    id: string;
    icon: string;
    name: string;
    adapter: AdapterConstructor;
  }

  export interface WalletState {
    account: Account | null;
    activeWallet: string | null;
  }

  type WalletEventCallback = (state: WalletState) => void;

  export interface AdapterConfig {
    whitelist?: string[];
    host?: string;
    identityProvider?: string;
    timeout?: number;
    [key: string]: any;
  }

  export interface TransferParams {
    to: string;
    amount: bigint;
    fee?: bigint;
    memo?: Uint8Array;
    fromSubaccount?: Uint8Array;
  }

  export type AdapterConstructor = new () => AdapterInterface;

  // Transaction related export interfaces
  export namespace Transaction {
    export interface Item {
      updateNextStep?: (data: any, nextStep: any) => Promise<void>;
      onSuccess?: (data: any) => Promise<void>;
      onFail?: (data: any) => Promise<void>;
      stepIndex?: number;
      state?: string;
      canisterId?: string;
      idl?: any;
      methodName?: string;
      args?: any[];
      onSuccessMain?: (data: any, _this: Item) => Promise<boolean | undefined>;
      onFailMain?: (err: any, _this: Item) => Promise<boolean>;
    }
  }

  // Plug-specific methods
  export interface PlugInterface {
    requestConnect: (params: any) => Promise<any>;
    isConnected: () => Promise<boolean>;
    createActor: <T>(options: {
      canisterId: string;
      interfaceFactory: any;
    }) => Promise<ActorSubclass<T>>;
    requestBalance: () => Promise<
      Array<{
        amount: number;
        currency: string;
        image: string;
        name: string;
        value: number;
      }>
    >;
    requestTransfer: (params: TransferParams) => Promise<{ height: number }>;
    requestTransferToken: (params: any) => Promise<any>;
    requestBurnXTC: (params: { to: string; amount: number }) => Promise<any>;
    batchTransactions: (transactions: Transaction.Item[]) => Promise<any>;
    createAgent: (options?: {
      whitelist: string[];
      host?: string;
    }) => Promise<void>;
    disconnect: () => Promise<void>;
    accountId: string;
    principalId: string;
  }

  // Bitfinity-specific methods
  export interface BitfinityInterface {
    getUserAssets: () => Promise<any>;
    batchTransactions: (
      transactions: any[],
      options?: { host?: string }
    ) => Promise<void>;
  }

  export type Adapters = {
    nns: Adapter.Interface;
    plug: Adapter.Interface;
    bitfinity: Adapter.Interface;
  };
}

// ICRC related export interfaces
export namespace ICRC {
  export interface Standard {
    name: string;
    url: string;
  }

  export interface Adapter {
    getSupportedStandards(): Promise<Standard[]>;
  }
}

export namespace Adapter {
  export abstract class Interface {
    constructor(url: string);
    url: string;
    wallets: Wallet.AdapterInfo[];
    state: Wallet.WalletState;
    abstract isAvailable(): Promise<boolean>;
    abstract connect(config: Wallet.AdapterConfig): Promise<Wallet.Account>;
    abstract disconnect(): Promise<void>;
    abstract createActor<T>(
      canisterId: string,
      idl: any
    ): Promise<ActorSubclass<T>>;
    abstract getAccountId(): Promise<string | null>;
    abstract getPrincipal(): Promise<Principal | null>;
    abstract getBalance(): Promise<bigint>;
    abstract createAgent(options?: {
      whitelist: string[];
      host?: string;
    }): Promise<void>;
    abstract icrc1BalanceOf(
      canisterId: string,
      account?: Wallet.Account
    ): Promise<BigInt>;
    abstract icrc1Transfer(
      canisterId,
      params: Wallet.TransferParams
    ): Promise<void>;
    abstract icrc1Metadata(canisterId: string): Promise<any>;
    abstract requestTransfer(params: Wallet.TransferParams): Promise<any>;
    abstract isConnected(): Promise<boolean | undefined>;
    abstract whoAmI(): Promise<Principal | null>;
  }
}

declare global {
  interface Window {
    ic?: {
      plug?: Wallet.PlugInterface;
      infinityWallet?: Wallet.BitfinityInterface;
    };
    pnp: Wallet.PnPWindow;
  }
}
