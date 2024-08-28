import { Buffer } from '../buffer';
declare global {
    interface Window {
        Buffer: typeof Buffer;
    }
}
declare const getTokenIdentifier: (canisterId: string, tokenIndex: number) => string;
declare const getAccountIdentifier: (principalId: string, subAccount?: string | number) => string | false;
export { getTokenIdentifier, getAccountIdentifier };
