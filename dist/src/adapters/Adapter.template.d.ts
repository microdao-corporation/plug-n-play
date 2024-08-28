import { Wallet } from '../../types';
export declare class TemplateAdapter extends Wallet.AdapterInterface {
    name: string;
    logo: string;
    readyState: string;
    url: string;
    constructor();
    disconnect(): Promise<void>;
    getBalance(): Promise<bigint>;
    transfer(params: Wallet.TransferParams): Promise<void>;
    createActor<T>(canisterId: string, idl: any): Promise<T>;
    getAccountId(): Promise<string | boolean>;
    getPrincipal(): Promise<string | boolean>;
    isConnected(): Promise<boolean>;
    whoAmI(): Promise<string>;
    isAvailable(): Promise<boolean>;
    connect(_config: Wallet.AdapterConfig): Promise<Wallet.Account>;
}
