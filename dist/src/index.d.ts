import { Wallet } from '../types';
import { ActorSubclass } from '@dfinity/agent';
declare class PnP {
    private account;
    private activeWallet;
    private provider;
    private balance;
    private canisterActors;
    private anonCanisterActors;
    private wallets;
    private config;
    private walletState;
    private callbacks;
    constructor(config?: Wallet.PnPConfig);
    private _initializeFromLocalStorage;
    registerCallback(callback: Wallet.WalletEventCallback): void;
    private triggerCallbacks;
    connect(walletId: string, connectObj?: Wallet.PnPConfig): Promise<string | false>;
    disconnect(): Promise<boolean>;
    getWalletBalance(): Promise<number>;
    getSignedActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>>;
    getCanisterActor<T>(canisterId: string, idl: any, isAnon?: boolean, isForced?: boolean, isSigned?: boolean): Promise<ActorSubclass<T>>;
    transfer(params: any): Promise<any>;
    isWalletConnected(): boolean;
    private _dispatchWalletConnectedEvent;
}
export default PnP;
