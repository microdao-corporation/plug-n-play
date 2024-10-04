import { Adapter, Wallet } from '../../types/index';
import { ActorSubclass } from '../@dfinity/agent';
import { Principal } from '../@dfinity/principal';
declare class PNP {
    state: {
        account: Wallet.Account | null;
        activeWallet: string | null;
        provider: Adapter.Interface | null;
        canisterActors: Record<string, ActorSubclass<any>>;
        anonCanisterActors: Record<string, ActorSubclass<any>>;
        config: Wallet.PNPConfig;
    };
    constructor(config?: Wallet.PNPConfig);
    getAccountId(): string | null;
    getPrincipalId(): Principal | null;
    connect(walletId: string): Promise<Wallet.Account>;
    disconnect(): Promise<void>;
    callCanister<T>(canisterId: string, methodName: string, args?: any[], idl?: any, options?: {
        isAnon?: boolean;
        isSigned?: boolean;
    }): Promise<T>;
    getActor<T>(canisterId: string, idl: any, options?: {
        isAnon?: boolean;
        isForced?: boolean;
        isSigned?: boolean;
    }): Promise<ActorSubclass<T>>;
    private createAnonymousActor;
    private createSignedActor;
    isWalletConnected(): boolean;
    activeWallet(): Wallet.Account | null;
}
export declare const walletsList: Wallet.AdapterInfo[];
export declare const createPNP: (config?: Wallet.PNPConfig) => PNP;
export {};
