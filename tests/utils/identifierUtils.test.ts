import { describe, it, expect } from 'vitest';
import { getTokenIdentifier, getAccountIdentifier, generateChecksum, byteArrayToWordArray, wordArrayToByteArray } from '../../src/utils/identifierUtils';
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
    });
  });

  describe('getAccountIdentifier', () => {
    it('should generate a valid account identifier', () => {
      const principalId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
      const accountId = getAccountIdentifier(principalId);
      expect(typeof accountId).toBe('string');
      // @ts-ignore
      expect(accountId!.length).toBe(64);
    });

    it('should generate a valid account identifier with a subaccount', () => {
      const principalId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
      const subAccount = 1;
      const accountId = getAccountIdentifier(principalId, subAccount);
      expect(typeof accountId).toBe('string');
      // @ts-ignore
      expect(accountId!.length).toBe(64);
    });

    it('should return false for invalid principal ID', () => {
      const invalidPrincipalId = 'invalid-principal-id';
      const accountId = getAccountIdentifier(invalidPrincipalId);
      expect(accountId).toBe(false);
    });
  });

  describe('Utility Functions', () => {
    it('byteArrayToWordArray and wordArrayToByteArray should convert data correctly', () => {
      const byteArray = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
      const wordArray = crypto.lib.WordArray.create([0x01020304], 4);

      const convertedWordArray = byteArrayToWordArray(byteArray);
      expect(convertedWordArray.toString()).toBe(wordArray.toString());

      const convertedByteArray = wordArrayToByteArray(wordArray, 4);
      expect(convertedByteArray).toEqual(Array.from(byteArray));
    });

    it('generateChecksum should generate a valid checksum', () => {
      const byteArray = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
      const checksum = generateChecksum(byteArray);
      expect(checksum.length).toBe(8);
    });
  });
});
