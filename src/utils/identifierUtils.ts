import { Principal } from '@dfinity/principal';
import crc32 from 'buffer-crc32';
import { Buffer } from 'buffer';
import crypto from 'crypto-js';

// Global declarations
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

if(typeof window !== 'undefined') {

window.Buffer = Buffer;
}
// Constants
const SUB_ACCOUNT_ZERO = Buffer.alloc(32);
const ACCOUNT_DOMAIN_SEPARATOR = '\x0Aaccount-id';

// Helper functions
const to32bits = (num: number): number[] => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

const intToHex = (val: number): string =>
  val < 0 ? (Number(val) >>> 0).toString(16) : Number(val).toString(16);

const byteArrayToWordArray = (byteArray: Uint8Array): crypto.lib.WordArray => {
  const wordArray: number[] = [];
  for (let i = 0; i < byteArray.length; i += 1) {
    wordArray[(i / 4) | 0] |= byteArray[i] << (24 - 8 * (i % 4));
  }
  return crypto.lib.WordArray.create(wordArray, byteArray.length);
};

const wordToByteArray = (word: number, length: number): number[] => {
  const byteArray: number[] = [];
  const xFF = 0xff;
  if (length > 0) byteArray.push(word >>> 24);
  if (length > 1) byteArray.push((word >>> 16) & xFF);
  if (length > 2) byteArray.push((word >>> 8) & xFF);
  if (length > 3) byteArray.push(word & xFF);
  return byteArray;
};

const wordArrayToByteArray = (
  wordArray: crypto.lib.WordArray | number[],
  length: number
): number[] => {
  if ('sigBytes' in wordArray && 'words' in wordArray) {
    length = wordArray.sigBytes;
    wordArray = wordArray.words;
  }

  let result: number[] = [];
  let bytes: number[];
  let i = 0;
  while (length > 0) {
    bytes = wordToByteArray(wordArray[i], Math.min(4, length));
    length -= bytes.length;
    result = [...result, ...bytes];
    i++;
  }
  return result;
};

// Main functions
const getTokenIdentifier = (canisterId: string, tokenIndex: number): string => {
  const padding = Buffer.from('\x0Atid');
  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(canisterId).toUint8Array(),
    ...to32bits(tokenIndex),
  ]);
  const principalId = Principal.fromUint8Array(array).toText();
  return `${principalId}-${tokenIndex}`;
};

const generateChecksum = (hash: Uint8Array | number[]): string => {
  const byteArray = new Uint8Array(hash);
  const crc = crc32.unsigned(Buffer.from(byteArray));
  const hex = intToHex(crc);
  return hex.padStart(8, '0');
};

const getAccountIdentifier = (
  principalId: string,
  subAccount: string | number = ''
): string | false => {
  try {
    const principal = Principal.from(principalId);
    const sha = crypto.algo.SHA224.create();
    sha.update(ACCOUNT_DOMAIN_SEPARATOR);
    sha.update(byteArrayToWordArray(principal.toUint8Array()));
    const subBuffer = Buffer.from(SUB_ACCOUNT_ZERO);
    if (subAccount) {
      subBuffer.writeUInt32BE(Number(subAccount));
    }
    sha.update(byteArrayToWordArray(subBuffer));
    const hash = sha.finalize();
    const byteArray = wordArrayToByteArray(hash, 28);
    const checksum = generateChecksum(byteArray);
    return checksum + hash.toString();
  } catch (error) {
    console.error(error);
    return false;
  }
};

export {
  getTokenIdentifier,
  getAccountIdentifier,
  generateChecksum,
  byteArrayToWordArray,
  wordArrayToByteArray
};