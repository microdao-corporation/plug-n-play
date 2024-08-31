import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NNSAdapter } from '../src/adapters/NNSAdapter';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

const USE_REAL_LIBRARIES = process.env.USE_REAL_LIBRARIES === 'true';

if (!USE_REAL_LIBRARIES) {
  vi.mock("@dfinity/auth-client");
  vi.mock("@dfinity/agent");
  vi.mock("../src/utils/identifierUtils", () => ({
    getAccountIdentifier: vi.fn().mockReturnValue("mock-account-identifier"),
  }));
}

describe('NNSAdapter', () => {
  let adapter: NNSAdapter;

  beforeEach(async () => {
    adapter = new NNSAdapter();
    
    if (!USE_REAL_LIBRARIES) {
      const mockAuthClient = {
        isAuthenticated: vi.fn().mockResolvedValue(false),
        login: vi.fn(),
        getIdentity: vi.fn().mockReturnValue({
          getPrincipal: () => Principal.fromText("2vxsx-fae"),
        }),
        logout: vi.fn(),
      };
      (AuthClient.create as any).mockResolvedValue(mockAuthClient);
      (HttpAgent.createSync as any).mockReturnValue({
        fetchRootKey: vi.fn(),
      });
      adapter['authClient'] = await AuthClient.create();
      adapter['agent'] = {} as HttpAgent; // Mock the agent to prevent "not initialized" error
    } else {
      adapter['authClient'] = await AuthClient.create();
      // Note: In a real scenario, you'd need to handle agent creation and authentication
    }
  });

  afterEach(() => {
    if (!USE_REAL_LIBRARIES) {
      vi.clearAllMocks();
    }
  });

  describe('getAccountId', () => {
    it('should return account identifier or throw if not connected', async () => {
      if (USE_REAL_LIBRARIES) {
        await expect(adapter.getAccountId()).rejects.toThrow("Wallet is not connected or initialized");
      } else {
        const accountId = await adapter.getAccountId();
        expect(accountId).toBe("mock-account-identifier");
      }
    }, 15000); // Increase timeout to 15 seconds

    it('should throw an error if authClient is not initialized', async () => {
      adapter['authClient'] = null;
      await expect(adapter.getAccountId()).rejects.toThrow("Wallet is not connected or initialized");
    });
  });
});