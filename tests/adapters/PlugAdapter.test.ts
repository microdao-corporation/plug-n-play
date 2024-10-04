import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PlugAdapter } from "../../src/adapters/PlugAdapter";
import { Principal } from "@dfinity/principal";

describe("PlugAdapter", () => {
  let adapter: PlugAdapter;
  let mockWindow: any;

  beforeEach(() => {
    mockWindow = {
      ic: {
        plug: {
          isConnected: vi.fn().mockResolvedValue(false),
          requestConnect: vi.fn().mockResolvedValue(true),
          createActor: vi.fn().mockResolvedValue({}),
          principalId: "2vxsx-fae",
          accountId: "test-account-id",
          requestBalance: vi.fn().mockResolvedValue([{ currency: "ICP", amount: "100" }]),
          disconnect: vi.fn().mockResolvedValue(undefined),
        },
      },
      open: vi.fn(),
    };

    global.window = mockWindow as any;
    adapter = new PlugAdapter();
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete global.window;
  });

  it("should have correct default properties", () => {
    expect(adapter.name).toBe("Plug");
    expect(adapter.logo).toBe("path_to_plug_logo.svg");
    expect(adapter.url).toBe("https://plugwallet.ooo/");
  });

  it("should check if the wallet is available", async () => {
    const isAvailable = await adapter.isAvailable();
    expect(isAvailable).toBe(true);
  });

  it("should connect to the wallet", async () => {
    const account = await adapter.connect({});
    expect(account).toEqual({
      owner: Principal.fromText("2vxsx-fae"),
      subaccount: null,
    });
  });

  it("should get principal", async () => {
    const principal = await adapter.getPrincipal();
    expect(principal).toEqual(Principal.fromText("2vxsx-fae"));
  });

  it("should get account ID", async () => {
    const accountId = await adapter.getAccountId();
    expect(accountId).toBe("test-account-id");
  });

  it("should create an actor", async () => {
    const actor = await adapter.createActor("canister-id", {});
    expect(actor).toEqual({});
  });

  it("should get balance", async () => {
    const balance = await adapter.getBalance();
    expect(balance).toBe(BigInt(100));
  });

  it("should disconnect", async () => {
    await adapter.disconnect();
    expect(mockWindow.ic.plug.disconnect).toHaveBeenCalled();
  });
});
