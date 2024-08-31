import { Principal } from '@dfinity/principal';
import { Wallet, Adapter } from '../../types/index';
export declare class TemplateAdapter extends Adapter.Interface {
    icrc1_transfer(canisterId: any, params: Wallet.TransferParams): Promise<void>;
    icrc1BalanceOf(canisterId: Principal, account?: Wallet.Account): Promise<BigInt>;
    name: string;
    logo: string;
    readyState: string;
    url: string;
    constructor();
    disconnect(): Promise<void>;
    getBalance(): Promise<bigint>;
    requestTransfer: (params: Wallet.TransferParams) => Promise<void>;
    transfer(params: Wallet.TransferParams): Promise<void>;
    createActor<T>(canisterId: string, idl: any): Promise<T>;
    getAccountId(): Promise<string | null>;
    getPrincipal(): Promise<Principal | null>;
    isConnected(): Promise<boolean>;
    whoAmI(): Promise<Principal | null>;
    isAvailable(): Promise<boolean>;
    connect(_config: Wallet.AdapterConfig): Promise<Wallet.Account>;
}
