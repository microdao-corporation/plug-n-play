import { Adapter, Wallet } from '../types/index';
import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
declare class PnP {
    state: {
        account: Wallet.Account | null;
        activeWallet: string | null;
        provider: Adapter.Interface | null;
        canisterActors: Record<string, ActorSubclass<any>>;
        anonCanisterActors: Record<string, ActorSubclass<any>>;
        config: Wallet.PnPConfig;
        callbacks: Wallet.WalletEventCallback[];
    };
    constructor(config?: Wallet.PnPConfig);
    getAccountId(): string | null;
    getPrincipalId(): Principal | null;
    connect(walletId: string): Promise<Wallet.Account>;
    disconnect(): Promise<void>;
    icrc1BalanceOf(canisterId: string, account: Wallet.Account): Promise<BigInt>;
    icrc1Transfer(canisterId: Principal, params: Wallet.TransferParams): Promise<any>;
    icrc1Metadata(canisterId: string): Promise<any>;
    getSignedActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>>;
    getCanisterActor<T>(canisterId: string, idl: any, isAnon?: boolean, isForced?: boolean, isSigned?: boolean): Promise<ActorSubclass<T>>;
    createAgent(options?: {
        whitelist: string[];
        host?: string;
    }): Promise<void>;
    isWalletConnected(): boolean;
    activeWallet(): string | null;
    registerCallback(callback: Wallet.WalletEventCallback): void;
}
export declare const walletsList: Wallet.AdapterInfo[];
export declare const createPnP: (config?: Wallet.PnPConfig) => PnP;
export {};
