import { ActorSubclass } from '../@dfinity/agent';
import { Wallet, Adapter } from '../../types/index';
import { Principal } from '../@dfinity/principal';
export declare class NNSAdapter implements Adapter.Interface {
    url: string;
    private authClient;
    private agent;
    constructor();
    isAvailable(): Promise<boolean>;
    connect(config: Wallet.PNPConfig): Promise<Wallet.Account | boolean>;
    private _continueLogin;
    disconnect(): Promise<void>;
    createActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>>;
    createAgent(options: {
        whitelist?: string[];
        host?: string;
    }): Promise<void>;
    icrc1BalanceOf(canisterId: string, account: Wallet.Account): Promise<bigint>;
    icrc1Transfer(canisterId: Principal | string, params: Wallet.TransferParams): Promise<any>;
}
