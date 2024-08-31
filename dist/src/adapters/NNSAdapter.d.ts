import { ActorSubclass } from '@dfinity/agent';
import { Wallet, Adapter } from '../types/index';
import { Principal } from '@dfinity/principal';
export declare class NNSAdapter implements Adapter.Interface {
    name: string;
    logo: string;
    readyState: string;
    url: string;
    wallets: Wallet.AdapterInfo[];
    private authClient;
    private agent;
    constructor();
    state: Wallet.WalletState;
    icrc1Metadata(canisterId: string): Promise<any>;
    requestTransfer(params: Wallet.TransferParams): Promise<void>;
    isAvailable(): Promise<boolean>;
    connect(config: Wallet.AdapterConfig): Promise<Wallet.Account>;
    private _continueLogin;
    icrc1BalanceOf(canisterId: string, account: Wallet.Account): Promise<BigInt>;
    disconnect(): Promise<void>;
    createActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>>;
    createAgent(options?: {
        whitelist: string[];
        host?: string;
    }): Promise<void>;
    getAccountId(): Promise<string | null>;
    getPrincipal(): Promise<Principal | null>;
    getBalance(): Promise<bigint>;
    icrc1Transfer(canisterId: Principal, params: Wallet.TransferParams): Promise<void>;
    whoAmI(): Promise<Principal | null>;
    isConnected(): Promise<boolean>;
}
