import { Buffer } from '../buffer';
import { default as crypto } from '../crypto-js';
declare global {
    interface Window {
        Buffer: typeof Buffer;
    }
}
declare const byteArrayToWordArray: (byteArray: Uint8Array) => crypto.lib.WordArray;
declare const wordArrayToByteArray: (wordArray: crypto.lib.WordArray | number[], length: number) => number[];
declare const getTokenIdentifier: (canisterId: string, tokenIndex: number) => string;
declare const generateChecksum: (hash: Uint8Array | number[]) => string;
declare const getAccountIdentifier: (principalId: string, subAccount?: string | number) => string | false;
export { getTokenIdentifier, getAccountIdentifier, generateChecksum, byteArrayToWordArray, wordArrayToByteArray };
