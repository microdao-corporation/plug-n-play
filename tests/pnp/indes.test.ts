import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createPNP, walletsList } from "../../src/pnp/index";
import { Principal } from "@dfinity/principal";
import { HttpAgent, Actor } from "@dfinity/agent";

vi.mock("@dfinity/agent", () => {
  return {
    HttpAgent: {
      create: vi.fn().mockResolvedValue({
        fetchRootKey: vi.fn().mockResolvedValue(undefined),
      }),
    },
    Actor: {
      createActor: vi.fn().mockReturnValue({}),
    },
    AnonymousIdentity: vi.fn(),
  };
});

vi.mock("../../src/adapters", () => ({
  walletList: [
    {
      id: "test-wallet",
      name: "Test Wallet",
      adapter: class {
        isAvailable = vi.fn().mockResolvedValue(true);
        connect = vi.fn().mockResolvedValue({
          owner: Principal.fromText("2vxsx-fae"),
          subaccount: null,
        });
        disconnect = vi.fn().mockResolvedValue(undefined);
        createActor = vi.fn().mockResolvedValue({});
      },
    },
  ],
}));

describe("PNP", () => {
  let pnp: ReturnType<typeof createPNP>;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    pnp = createPNP({ hostUrl: "http://localhost:4943" });
    mockLocalStorage = {};
    global.localStorage = {
      getItem: vi.fn((key) => mockLocalStorage[key]),
      setItem: vi.fn((key, value) => {
        mockLocalStorage[key] = value.toString();
      }),
      removeItem: vi.fn((key) => {
        delete mockLocalStorage[key];
      }),
    } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ... (other tests remain the same)

  it("should create an anonymous actor", async () => {
    const actor = await pnp["createAnonymousActor"]("canister-id", {});
    expect(HttpAgent.create).toHaveBeenCalledWith({
      identity: expect.any(Object),
      host: "http://localhost:4943",
    });
    const mockAgent = await (HttpAgent.create as any)();
    expect(mockAgent.fetchRootKey).toHaveBeenCalled();
    expect(Actor.createActor).toHaveBeenCalledWith({}, {
      agent: expect.any(Object),
      canisterId: "canister-id",
    });
  });

  it("should get the account ID", () => {
    const accountId = pnp.getAccountId();
    expect(accountId).toBe(null);
  });

  it("should get the principal", () => {
    const principal = pnp.getPrincipalId();
    expect(principal).toBe(null);
  });

  it("should check if the wallet is connected", () => {
    const isConnected = pnp.isWalletConnected();
    expect(isConnected).toBe(false);
  });

  it("should get the active wallet", () => {
    const wallet = pnp.activeWallet();
    expect(wallet).toBe(null);
  });

  it("should disconnect from the wallet", async () => {
    await pnp.disconnect();
    expect(HttpAgent.create).not.toHaveBeenCalled();
  });  
});

describe("walletsList", () => {
  it("should export walletsList", () => {
    expect(walletsList).toBeDefined();
    expect(Array.isArray(walletsList)).toBe(true);
    expect(walletsList[0].id).toBe("test-wallet");
  });
});
