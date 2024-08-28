// Adapters
import { NNSAdapter } from "./src/adapters/NNSAdapter";
import { PlugAdapter } from "./src/adapters/PlugAdapter";
import { BatchTransact } from "./src/utils/batchTransact";  // Import BatchTransact if not already imported
import { AnonymousIdentity } from "@dfinity/agent"; // Import these if they're used
import { Principal } from "@dfinity/principal";    // Import these if they're used
import { ActorSubclass } from "@dfinity/agent";

declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

export namespace Wallet {
  export interface PnPConfig {
    hostUrl?: string;
    localStorageKey?: string;
    defaultCanisterId?: string;
    identityProvider?: string;
    [key: string]: any;
  }

  export interface PnPWindow {  // Adjust interface name as necessary
    BatchTransact: typeof BatchTransact;
    nns: {
      AnonymousIdentity: typeof AnonymousIdentity;
      Principal: typeof Principal;
    };
  }

  export interface Account {
    accountId: string | boolean;
    principalId: string;
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
    exeBalance: number;
    icpBalance: number;
  }

  type WalletEventCallback = (state: WalletState) => void;

  export interface AdapterConfig {
    whitelist?: string[];
    host?: string;
    identityProvider?: string;
    [key: string]: any;
  }

  export interface TransferParams {
    to: string;
    amount: bigint;
    fee?: bigint;
    memo?: Uint8Array;
    fromSubaccount?: Uint8Array;
  }

  export abstract class AdapterInterface {
    constructor(url: string);
    url: string;
    abstract isAvailable(): Promise<boolean>;
    abstract connect(config: AdapterConfig): Promise<Account>;
    abstract disconnect(): Promise<void>;
    abstract getBalance(): Promise<bigint>;
    abstract transfer(params: TransferParams): Promise<void>;
    abstract createActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>>; // Keep only one declaration
    abstract getAccountId(): Promise<string | boolean>;
    abstract getPrincipal(): Promise<string | boolean>;
    abstract isConnected(): Promise<boolean | undefined>;
    abstract whoAmI(): Promise<string>;
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
  export type Adapters = {
    nns: typeof NNSAdapter;
    plug: typeof PlugAdapter;
  };

  const adapters: Adapters;
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

export namespace Adapters {
  export interface ICPlug {
    isConnected: () => Promise<boolean>;
    requestConnect: (options: {
      whitelist: string[];
      host: string;
      timeout?: number;
      onConnectionUpdate: () => void;
    }) => Promise<string>;
    createAgent: (options: { whitelist: string[]; host: string }) => Promise<void>;
    agent: {
      getPrincipal: () => Promise<{ toString: () => string }>;
    };
    accountId: string;
    disconnect: () => Promise<void>;
    requestTransfer: (params: Wallet.TransferParams) => Promise<any>;
    createActor: (options: { canisterId: string; interfaceFactory: any }) => Promise<ActorSubclass<any>>;
    principalId: string;
    requestTransferToken: (params: any) => Promise<any>;
    requestBurnXTC: (params: any) => Promise<any>;
    batchTransactions: (transactions: any[]) => Promise<any>;
  }
}

declare global {
  interface Window {
    ic?: {
      plug?: Adapters.ICPlug;
    };
    pnp: Wallet.PnPWindow;  // Make sure this matches the Wallet.PnPWindow interface
  }
}
