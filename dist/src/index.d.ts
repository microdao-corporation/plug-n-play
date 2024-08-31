import { Wallet } from '../types/index';
import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
declare class PnP {
    private state;
    constructor(config?: Wallet.PnPConfig);
    getAccountId(): string | null;
    getPrincipalId(): Principal | null;
    connect(walletId: string): Promise<Wallet.Account>;
    disconnect(): Promise<void>;
    icrc1BalanceOf(canisterId: Principal, account: Wallet.Account): Promise<BigInt>;
    icrc1Transfer(canisterId: Principal, params: Wallet.TransferParams): Promise<any>;
    getSignedActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>>;
    getCanisterActor<T>(canisterId: string, idl: any, isAnon?: boolean, isForced?: boolean, isSigned?: boolean): Promise<ActorSubclass<T>>;
    isWalletConnected(): boolean;
    registerCallback(callback: Wallet.WalletEventCallback): void;
}
export declare const walletsList: Wallet.AdapterInfo[];
export declare const createPnP: (config?: Wallet.PnPConfig) => PnP;
export {};
