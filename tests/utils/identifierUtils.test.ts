import { describe, it, expect } from 'vitest';
import {
  getTokenIdentifier,
  getAccountIdentifier,
  generateChecksum,
  byteArrayToWordArray,
  wordArrayToByteArray
} from '../../src/utils/identifierUtils';
import { Principal } from '@dfinity/principal';
import crypto from 'crypto-js';

describe('Token and Account Identifier Utilities', () => {
  describe('getTokenIdentifier', () => {
    it('should generate a valid token identifier', () => {
      const canisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
      const tokenIndex = 1;

      const tokenId = getTokenIdentifier(canisterId, tokenIndex);
      expect(typeof tokenId).toBe('string');

      const tokenParts = tokenId.split('-');
      expect(tokenParts.length).toBeGreaterThan(1);

      expect(() => Principal.fromText(tokenParts.slice(0, -1).join('-'))).not.toThrow();
      expect(Number(tokenParts[tokenParts.length - 1])).toBe(tokenIndex);
    });

    it('should generate different identifiers for different token indexes', () => {
      const canisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
      const tokenId1 = getTokenIdentifier(canisterId, 1);
      const tokenId2 = getTokenIdentifier(canisterId, 2);
      expect(tokenId1).not.toBe(tokenId2);
    });

    it('should throw an error for invalid canister ID', () => {
      const invalidCanisterId = 'invalid-canister-id';
      expect(() => getTokenIdentifier(invalidCanisterId, 1)).toThrow();
    });
  });

  describe('getAccountIdentifier', () => {
    it('should generate a valid account identifier', () => {
      const principalId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
      const accountId = getAccountIdentifier(principalId);
      expect(typeof accountId).toBe('string');
      expect(accountId).toHaveLength(64);
    });

    it('should generate a valid account identifier with a subaccount', () => {
      const principalId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
      const subAccount = 1;
      const accountId = getAccountIdentifier(principalId, subAccount);
      expect(typeof accountId).toBe('string');
      expect(accountId).toHaveLength(64);
    });

    it('should return false for invalid principal ID', () => {
      const invalidPrincipalId = 'invalid-principal-id';
      const accountId = getAccountIdentifier(invalidPrincipalId);
      expect(accountId).toBe(false);
    });

    it('should generate different identifiers for different principals', () => {
      const principalId1 = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
      const principalId2 = 'aaaaa-aa';
      const accountId1 = getAccountIdentifier(principalId1);
      const accountId2 = getAccountIdentifier(principalId2);
      expect(accountId1).not.toBe(accountId2);
    });

    it('should generate different identifiers for different subaccounts', () => {
      const principalId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
      const accountId1 = getAccountIdentifier(principalId, 0);
      const accountId2 = getAccountIdentifier(principalId, 1);
      expect(accountId1).not.toBe(accountId2);
    });
  });

  describe('Utility Functions', () => {
    describe('byteArrayToWordArray and wordArrayToByteArray', () => {
      it('should convert data correctly', () => {
        const byteArray = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
        const wordArray = crypto.lib.WordArray.create([0x01020304], 4);

        const convertedWordArray = byteArrayToWordArray(byteArray);
        expect(convertedWordArray.toString()).toBe(wordArray.toString());

        const convertedByteArray = wordArrayToByteArray(wordArray, 4);
        expect(convertedByteArray).toEqual(Array.from(byteArray));
      });

      it('should handle empty arrays', () => {
        const emptyByteArray = new Uint8Array([]);
        const emptyWordArray = crypto.lib.WordArray.create([], 0);

        const convertedWordArray = byteArrayToWordArray(emptyByteArray);
        expect(convertedWordArray.toString()).toBe(emptyWordArray.toString());

        const convertedByteArray = wordArrayToByteArray(emptyWordArray, 0);
        expect(convertedByteArray).toEqual([]);
      });

      it('should handle arrays of various lengths', () => {
        const testCases = [
          new Uint8Array([0x01]),
          new Uint8Array([0x01, 0x02, 0x03]),
          new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05]),
        ];

        testCases.forEach(byteArray => {
          const wordArray = byteArrayToWordArray(byteArray);
          const convertedByteArray = wordArrayToByteArray(wordArray, byteArray.length);
          expect(convertedByteArray).toEqual(Array.from(byteArray));
        });
      });
    });

    describe('generateChecksum', () => {
      it('should generate a valid checksum', () => {
        const byteArray = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
        const checksum = generateChecksum(byteArray);
        expect(checksum).toHaveLength(8);
        expect(/^[0-9a-f]{8}$/.test(checksum)).toBe(true);
      });

      it('should generate different checksums for different inputs', () => {
        const byteArray1 = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
        const byteArray2 = new Uint8Array([0x04, 0x03, 0x02, 0x01]);
        const checksum1 = generateChecksum(byteArray1);
        const checksum2 = generateChecksum(byteArray2);
        expect(checksum1).not.toBe(checksum2);
      });

      it('should handle empty input', () => {
        const emptyByteArray = new Uint8Array([]);
        const checksum = generateChecksum(emptyByteArray);
        expect(checksum).toHaveLength(8);
        expect(/^[0-9a-f]{8}$/.test(checksum)).toBe(true);
      });
    });
  });
});