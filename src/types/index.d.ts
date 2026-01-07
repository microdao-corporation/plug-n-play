import { AnonymousIdentity, HttpAgent, ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { IIAdapterConfig, OisyAdapterConfig, PlugAdapterConfig, NFIDAdapterConfig, SiwsAdapterConfig } from "./AdapterConfigs";

declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";


export namespace Wallet {
  export interface Account {
    owner: string | null;
    subaccount: string | null;
  }

  export type AdapterConstructor = new (config: PnpConfig) => Adapter.Interface;
}


export interface GlobalPnpConfig {
  dfxNetwork?: string; // Useful for determining dev environment
  replicaPort?: number;
  solanaNetwork?: string;
  hostUrl?: string;
  delegationTimeout?: bigint;
  delegationTargets?: string[];
  derivationOrigin?: string;
  fetchRootKey?: boolean;
  verifyQuerySignatures?: boolean;
  localStorageKey?: string;
  siwsProviderCanisterId?: string;
  siweProviderCanisterId?: string;
  adapters?: Record<string, any>; // Adapter configurations
  logLevel?: LogLevel;
  persistenceKey?: string;
  storage?: Storage;
  maxStateHistorySize?: number;
  autoRecoverState?: boolean;
  validateStateOnLoad?: boolean;
}

export namespace Adapter {

  export interface ConstructorArgs { 
    adapter: Adapter.Config;
    config: GlobalPnpConfig;
  }

  export interface GetActorOptions {
    canisterId: string;
    idl: IDL.InterfaceFactory;
    anon?: boolean;
    requiresSigning?: boolean;
  }
  
  // deprecated
  export interface Config {
    id?: string;
    enabled?: boolean;
    logo?: string;
    walletName?: string;
    chain?: 'ICP' | 'SOL' | 'ETH' | 'MULTI';
    website?: string;
    adapter?: AdapterConstructor;
    config?: {
      [key: string]: any;
    }
  }

  // replaces Info
  export interface Wallet {
    adapter: AdapterConstructor;
  }

  export enum Status {
    INIT = "INIT",
    READY = "READY",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    DISCONNECTING = "DISCONNECTING",
    DISCONNECTED = "DISCONNECTED",
    ERROR = "ERROR",
  }

  export enum Chain {
    ICP = "icp",
    SOL = "sol",
    ETH = "eth",
  }

  export interface Addresses {
    [key in Chain]?: string | Wallet.Account;
  }

  export interface Interface {
    // Core wallet functionality
    openChannel(): Promise<void>;
    isConnected(): Promise<boolean>;
    connect(): Promise<Wallet.Account>;
    disconnect(): Promise<void>;
    getPrincipal(): Promise<string>;
    getAccountId(): Promise<string>;
    getAddresses(): Promise<Addresses>;
    // Actor creation
    createActor<T>(
      canisterId: string,
      idl: any,
      options?: { requiresSigning?: boolean },
    ): ActorSubclass<T>;
    icrcActor?<T = import("../did/icrc2.types").Icrc2Service>(params: { canisterId: string; anon?: boolean; requiresSigning?: boolean }): ActorSubclass<T>;
    icrc1Transfer?(canisterId: string, args: import("../did/icrc2.types").IcrcTransferArg, options?: { requiresSigning?: boolean }): Promise<any>;
    icrc2Approve?(canisterId: string, args: import("../did/icrc2.types").IcrcApproveArgs, options?: { requiresSigning?: boolean }): Promise<any>;
    icrc2TransferFrom?(canisterId: string, args: import("../did/icrc2.types").IcrcTransferFromArgs, options?: { requiresSigning?: boolean }): Promise<any>;
    icrc1Fee?(canisterId: string): Promise<bigint>;
    getIcrc1Balance?(
      canisterId: string,
      account: import("../did/icrc2.types").IcrcAccount
    ): Promise<bigint>;
    getIcrc1Name?(canisterId: string): Promise<string>;
    getIcrc1Symbol?(canisterId: string): Promise<string>;
    getIcrc1Decimals?(canisterId: string): Promise<number>;
    getIcrc1Metadata?(canisterId: string): Promise<Array<[string, any]>>;
    getIcrc1TotalSupply?(canisterId: string): Promise<bigint>;
    getIcrc1MintingAccount?(canisterId: string): Promise<[] | [import("../did/icrc2.types").IcrcAccount]>;
    getIcrc1SupportedStandards?(canisterId: string): Promise<Array<{ name: string; url: string }>>;
    getIcrc2Allowance?(
      canisterId: string,
      owner: import("../did/icrc2.types").IcrcAccount,
      spender: import("../did/icrc2.types").IcrcAccount
    ): Promise<{ allowance: bigint; expires_at: [] | [bigint] }>;
    ensureIcrc2Allowance?(
      canisterId: string,
      params: {
        spender: { owner: any; subaccount: any[] | [] } | string;
        requiredAmount: bigint;
        fromSubaccount?: Uint8Array | number[];
        memo?: Uint8Array | number[];
        createdAtTime?: bigint;
        expiresAt?: bigint;
        approveAmount?: bigint;
        approveMultiplier?: bigint;
        fee?: bigint;
      }
    ): Promise<{ ok: boolean; allowance: bigint; approved?: bigint; result?: any }>;
    undelegatedActor?<T>(
      canisterId: string,
      idlFactory: any,
      options?: { requiresSigning?: boolean },
    ): ActorSubclass<T>;
  }
}

export class PNP {
  account: Wallet.Account | null;
  provider: Adapter.Interface | null;
  config: PnpConfig;
  actorCache: Map<string, ActorSubclass<any>>;
  fetchRootKey: boolean;

  constructor(config?: PnpConfig);

  connect(walletId: string): Promise<Wallet.Account>;
  disconnect(): Promise<void>;
  isAuthenticated(): boolean;
  getActor<T>(canisterId: string, idl: any, isAnon?: boolean): ActorSubclass<T>;
  getIcrcActor<T>(canisterId: string, options?: { anon?: boolean; requiresSigning?: boolean }): ActorSubclass<T>;
  createAnonymousActor<T>(
    canisterId: string,
    idl: any,
    options?: { requiresSigning?: boolean },
  ): ActorSubclass<T>;
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
        disconnect: () => Promise<void>;
        onExternalDisconnect: (callback: () => void) => void;
        principalId?: string;
        accountId?: string;
      };
    };
  }
}
