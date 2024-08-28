import { SignIdentity } from '@dfinity/agent';
export class StoicIdentity extends SignIdentity {
    static disconnect(): void;
    static connect(host: any): Promise<any>;
    static load(host: any): Promise<any>;
    constructor(principal: any, pubkey: any);
    _principal: any;
    _publicKey: any;
    getPublicKey(): any;
    sign(data: any): Promise<any>;
    _transport(data: any): Promise<any>;
    accounts(): Promise<any>;
    transformRequest(request: any): Promise<any>;
}
