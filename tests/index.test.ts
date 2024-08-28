import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnonymousIdentity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { HOSTURL, NNS_CANISTER_ID } from '../src/constants';
import { BatchTransact } from '../src/utils/batchTransact';

// Mock the core PnP class with a spy
const PnP = vi.fn().mockImplementation(() => {
  return { mock: 'PnP instance' };
});

vi.mock('../src/index', () => {
  return {
    default: PnP
  };
});

describe('index.ts', () => {
  let indexModule: typeof import('../index');

  beforeEach(async () => {
    vi.resetModules();
    indexModule = await import('../index');
  });

  it('should export PnP', () => {
    expect(indexModule.PnP).toBeDefined();
  });

  it('should export BatchTransact', () => {
    expect(indexModule.BatchTransact).toBeDefined();
  });

  it('should export principalIdFromHex', () => {
    expect(indexModule.principalIdFromHex).toBeDefined();
    expect(indexModule.principalIdFromHex).toBe(indexModule.getAccountIdentifier);
  });

  it('should export getAccountIdentifier', () => {
    expect(indexModule.getAccountIdentifier).toBeDefined();
  });

  it('should export PnPAdapter', () => {
    expect(indexModule.PnPAdapter).toBeDefined();
    expect(PnP).toHaveBeenCalledWith({
      whitelist: [NNS_CANISTER_ID],
      host: HOSTURL,
      identityProvider: "",
    });
  });

  describe('browser environment', () => {
    const originalWindow = globalThis.window;

    beforeEach(async () => {
      vi.resetModules();
      globalThis.window = {
        addEventListener: vi.fn(),
        pnp: undefined,
      } as any;

      // Import the module again to reassign window.pnp
      indexModule = await import('../index');
    });

    afterEach(() => {
      globalThis.window = originalWindow;
    });

    it('should assign PnP to window.pnp', () => {
      expect(globalThis.window.pnp).toBeDefined();
      expect(globalThis.window.pnp).toHaveProperty('PnP');
    });

    it('should assign BatchTransact to window.pnp.BatchTransact', () => {
      expect(globalThis.window.pnp.BatchTransact).toBeDefined();
      expect(typeof globalThis.window.pnp.BatchTransact).toBe('function');
    });

    it('should assign AnonymousIdentity and Principal to window.pnp.nns', () => {
      expect(globalThis.window.pnp.nns).toBeDefined();
      expect(globalThis.window.pnp.nns.AnonymousIdentity).toBe(AnonymousIdentity);
      expect(globalThis.window.pnp.nns.Principal).toBe(Principal);
    });
  });
});
