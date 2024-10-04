import { ActorSubclass } from '../@dfinity/agent';
import { Principal } from '../@dfinity/principal';
import { Adapter, Wallet } from '../../types';
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
                requestBalance: () => Promise<Array<{
                    amount: number;
                    currency: string;
                    image: string;
                    name: string;
                    value: number;
                }>>;
                requestTransfer: (params: Wallet.TransferParams) => Promise<{
                    height: number;
                }>;
                requestTransferToken: (params: any) => Promise<any>;
                requestBurnXTC: (params: {
                    to: string;
                    amount: number;
                }) => Promise<any>;
                batchTransactions: (transactions: Wallet.Transaction.Item[]) => Promise<any>;
                disconnect: () => Promise<void>;
                principalId?: string;
                accountId?: string;
            };
        };
    }
}
export declare class PlugAdapter implements Adapter.Interface {
    name: string;
    logo: string;
    url: string;
    private readyState;
    constructor();
    private initPlug;
    isAvailable(): Promise<boolean>;
    connect(config: Wallet.AdapterConfig): Promise<Wallet.Account>;
    disconnect(): Promise<void>;
    getPrincipal(): Promise<Principal>;
    getAccountId(): Promise<string>;
    createActor<T>(canisterId: string, idlFactory: any): Promise<ActorSubclass<T>>;
    getBalance(): Promise<bigint>;
    icrc1Transfer(canisterId: Principal, params: Wallet.TransferParams): Promise<void>;
    private handleConnectionUpdate;
}
