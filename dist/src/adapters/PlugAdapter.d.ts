import { ActorSubclass } from '@dfinity/agent';
import { Wallet } from '../../types/index';
import { Principal } from '@dfinity/principal';
export declare class PlugAdapter implements Wallet.PlugInterface {
    name: string;
    logo: string;
    readyState: string;
    url: string;
    constructor();
    isAvailable(): Promise<boolean>;
    requestConnect(params: any): Promise<any>;
    isConnected(): Promise<boolean>;
    createActor<T>(options: {
        canisterId: string;
        interfaceFactory: any;
    }): Promise<ActorSubclass<T>>;
    requestBalance(): Promise<Array<{
        amount: number;
        currency: string;
        image: string;
        name: string;
        value: number;
    }>>;
    requestTransfer(params: Wallet.TransferParams): Promise<{
        height: number;
    }>;
    requestTransferToken(params: any): Promise<any>;
    requestBurnXTC(params: {
        to: string;
        amount: number;
    }): Promise<any>;
    batchTransactions(transactions: Wallet.Transaction.Item[]): Promise<any>;
    createAgent(options?: {
        whitelist: string[];
        host?: string;
    }): Promise<void>;
    disconnect(): Promise<void>;
    getAccountId(): string;
    getPrincipal(): Principal;
    connect(config: Wallet.AdapterConfig): Promise<Wallet.Account>;
    getBalance(): Promise<bigint>;
    icrc1Transfer(canisterId: Principal, params: Wallet.TransferParams): Promise<void>;
    whoAmI(): Promise<Principal>;
}
