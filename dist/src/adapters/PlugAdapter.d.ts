import { ActorSubclass } from '@dfinity/agent';
import { Wallet } from '../../types';
export declare class PlugAdapter implements Wallet.AdapterInterface {
    getBalance(): Promise<bigint>;
    isConnected(): Promise<boolean>;
    whoAmI(): Promise<string>;
    name: string;
    logo: string;
    readyState: string;
    url: string;
    constructor();
    isAvailable(): Promise<boolean>;
    connect(config: Wallet.AdapterConfig): Promise<Wallet.Account>;
    disconnect(): Promise<void>;
    transfer(params: Wallet.TransferParams): Promise<any>;
    createActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>>;
    getAccountId(): Promise<string>;
    getPrincipal(): Promise<string>;
    requestTransferToken(params: any): Promise<any>;
    requestBurnXTC(params: any): Promise<any>;
    batchTransactions(transactions: any[]): Promise<any>;
}
