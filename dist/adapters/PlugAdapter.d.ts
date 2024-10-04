import { ActorSubclass } from '../@dfinity/agent';
import { Principal } from '../@dfinity/principal';
import { Adapter, Wallet } from '../../types';
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
