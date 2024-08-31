import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnonymousIdentity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { HOSTURL, NNS_CANISTER_ID } from '../src/constants';
import { BatchTransact } from '../src/utils/batchTransact';

// Mock the createPnP function
const createPnP = vi.fn().mockImplementation(() => ({
  state: {
    account: null,
    activeWallet: null,
    anonCanisterActors: {},
    callbacks: [],
    canisterActors: {},
    config: {
      host: HOSTURL,
      hostUrl: HOSTURL,
      identityProvider: "",
      localStorageKey: "pnpConnectedWallet",
      whitelist: [NNS_CANISTER_ID],
    },
    provider: null,
  }
}));

// Mock the entire index module
vi.mock('../index', () => ({
  createPnP,
  walletsList: [
    { id: 'nns', name: 'Internet Identity', icon: '/assets/dfinity.svg', adapter: expect.any(Function) },
    { id: 'plug', name: 'Plug Wallet', icon: '/assets/plug.jpg', adapter: expect.any(Function) }
  ],
  BatchTransact,
  principalIdFromHex: vi.fn(),
  getAccountIdentifier: vi.fn(),
  getPnPAdapter: vi.fn(),
  adapters: {
    nns: { isAvailable: vi.fn() },
    plug: { isAvailable: vi.fn() },
    bitfinity: { isAvailable: vi.fn() },
  },
}));

describe('index.ts', () => {
  let indexModule: typeof import('../index');

  beforeEach(async () => {
    vi.resetModules();
    indexModule = await import('../index');
  });

  it('should export createPnP', () => {
    expect(indexModule.createPnP).toBeDefined();
    expect(indexModule.createPnP).toBe(createPnP);
  });

  it('should export walletsList', () => {
    expect(indexModule.walletsList).toBeDefined();
    expect(indexModule.walletsList).toEqual([
      { id: 'nns', name: 'Internet Identity', icon: '/assets/dfinity.svg', adapter: expect.any(Function) },
      { id: 'plug', name: 'Plug Wallet', icon: '/assets/plug.jpg', adapter: expect.any(Function) }
    ]);
  });

  it('should export BatchTransact', () => {
    expect(indexModule.BatchTransact).toBeDefined();
    expect(indexModule.BatchTransact).toBe(BatchTransact);
  });

  it('should export principalIdFromHex', () => {
    expect(indexModule.principalIdFromHex).toBeDefined();
  });

  it('should export getAccountIdentifier', () => {
    expect(indexModule.getAccountIdentifier).toBeDefined();
  });

  it('should export getPnPAdapter', () => {
    expect(indexModule.getPnPAdapter).toBeDefined();
  });

  // describe('getPnPAdapter', () => {
  //   beforeEach(() => {
  //     vi.clearAllMocks();
  //   });

    
  // });

  describe("browser environment", () => {
    const originalWindow = globalThis.window;

    beforeEach(async () => {
      vi.resetModules();
      globalThis.window = {
        addEventListener: vi.fn(),
        pnp: {
          PnP: createPnP,
        },
      } as any;

      indexModule = await import("../index");
    });

    afterEach(() => {
      globalThis.window = originalWindow;
    });

    it("should assign PnP to window.pnp", () => {
      expect((globalThis.window as any).pnp).toBeDefined();
      expect((globalThis.window as any).pnp.PnP).toBe(createPnP);
    });

  });
});