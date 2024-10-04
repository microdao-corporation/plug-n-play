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
  export interface PNPConfig {
    hostUrl?: string;
    localStorageKey?: string;
    defaultCanisterId?: string;
    identityProvider?: string;
    [key: string]: any;
  }

  export interface PNPWindow {
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
  export interface Interface {
    // Checks if the wallet is available (e.g., installed and accessible)
    isAvailable(): Promise<boolean>;
    // Connects to the wallet using the provided configuration
    connect(config: Wallet.PNPConfig): Promise<Wallet.Account | boolean>;
    // Disconnects from the wallet
    disconnect(): Promise<void>;
    // Creates an actor for a canister with the specified IDL
    createActor<T>(
      canisterId: string,
      idl: any
    ): Promise<ActorSubclass<T>>;
    // Performs a transfer of ICRC-1 tokens
    icrc1Transfer(
      canisterId: Principal | string,
      params: Wallet.TransferParams
    ): Promise<any>;
    // A string representing the URL to the wallet's website or download page
    url: string;
  }
}

declare global {
  interface Window {
    ic?: {
      plug?: {
        requestConnect: (options?: {
          whitelist?: string[];
          host?: string;
          timeout?: number;
          onConnectionUpdate?: () => void;
        }) => Promise<boolean>;
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
        requestTransfer: (params: Wallet.TransferParams) => Promise<{ height: number }>;
        requestTransferToken: (params: any) => Promise<any>;
        requestBurnXTC: (params: { to: string; amount: number }) => Promise<any>;
        batchTransactions: (transactions: Wallet.Transaction.Item[]) => Promise<any>;
        disconnect: () => Promise<void>;
        principalId?: string;
        accountId?: string;
      };
    };
  }
}