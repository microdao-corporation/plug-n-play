import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NNSAdapter } from "../../src/adapters/NNSAdapter";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

vi.mock("@dfinity/auth-client");
vi.mock("@dfinity/agent");

describe("NNSAdapter", () => {
  let adapter: NNSAdapter;
  let mockAuthClient: any;
  let mockHttpAgent: any;

  beforeEach(() => {
    mockAuthClient = {
      isAuthenticated: vi.fn().mockResolvedValue(false),
      login: vi.fn((options) => options.onSuccess()),
      getIdentity: vi.fn().mockReturnValue({
        getPrincipal: () => Principal.fromText("2vxsx-fae"),
      }),
      logout: vi.fn().mockResolvedValue(undefined),
    };

    mockHttpAgent = {
      fetchRootKey: vi.fn().mockResolvedValue(undefined),
    };

    vi.mocked(AuthClient.create).mockResolvedValue(mockAuthClient);
    vi.mocked(HttpAgent).mockImplementation(() => mockHttpAgent);
    vi.spyOn(Actor, 'createActor').mockReturnValue({} as any);

    adapter = new NNSAdapter();
    // @ts-ignore: Typescript doesn't like us setting private properties
    adapter.authClient = mockAuthClient;
    // @ts-ignore: Typescript doesn't like us setting private properties
    adapter.agent = mockHttpAgent;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should have the correct default URL", () => {
    expect(adapter.url).toBe("https://identity.ic0.app");
  });

  it("should always be available", async () => {
    const isAvailable = await adapter.isAvailable();
    expect(isAvailable).toBe(true);
  });

  it("should connect to the wallet", async () => {
    mockAuthClient.isAuthenticated.mockResolvedValueOnce(true);
    const account = await adapter.connect({ hostUrl: "https://localhost:8000" });
    expect(account).toEqual({
      owner: Principal.fromText("2vxsx-fae"),
      subaccount: expect.any(Uint8Array),
    });
  });

  it("should disconnect from the wallet", async () => {
    await adapter.disconnect();
    expect(mockAuthClient.logout).toHaveBeenCalled();
  });

  it("should create an actor", async () => {
    const actor = await adapter.createActor("canister-id", {});
    expect(Actor.createActor).toHaveBeenCalledWith({}, { agent: mockHttpAgent, canisterId: "canister-id" });
  });

  it("should create an agent", async () => {
    await adapter.createAgent({ host: "https://localhost:8000" });
    expect(HttpAgent).toHaveBeenCalledWith({
      identity: expect.anything(),
      host: "https://localhost:8000",
    });
  });

  it("should get ICRC-1 balance", async () => {
    vi.mocked(Actor.createActor).mockReturnValueOnce({
      icrc1_balance_of: vi.fn().mockResolvedValue(BigInt(100)),
    } as any);

    const balance = await adapter.icrc1BalanceOf("canister-id", {
      owner: Principal.fromText("2vxsx-fae"),
      subaccount: new Uint8Array(),
    });
    expect(balance).toBe(BigInt(100));
  });

  it("should perform ICRC-1 transfer", async () => {
    const mockTransfer = vi.fn().mockResolvedValue({ Ok: BigInt(1) });
    vi.mocked(Actor.createActor).mockReturnValueOnce({
      icrc1_transfer: mockTransfer,
    } as any);

    const result = await adapter.icrc1Transfer("canister-id", {
      to: { owner: Principal.fromText("aaaaa-aa"), subaccount: null },
      amount: BigInt(10),
    });
    expect(mockTransfer).toHaveBeenCalledWith({
      to: { owner: Principal.fromText("aaaaa-aa"), subaccount: null },
      amount: BigInt(10),
    });
    expect(result).toEqual({ Ok: BigInt(1) });
  });
});
