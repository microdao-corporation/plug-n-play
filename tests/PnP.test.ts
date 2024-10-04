import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NNSAdapter } from "../src/adapters/NNSAdapter";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

vi.mock("@dfinity/auth-client");
vi.mock("@dfinity/agent");

describe("NNSAdapter", () => {
  let adapter: NNSAdapter;
  let mockHttpAgent: any;

  beforeEach(async () => {
    adapter = new NNSAdapter();

    const mockAuthClient = {
      isAuthenticated: vi.fn().mockResolvedValue(false),
      login: vi.fn(),
      getIdentity: vi.fn().mockReturnValue({
        getPrincipal: () => Principal.fromText("2vxsx-fae"),
      }),
      logout: vi.fn(),
    };

    mockHttpAgent = {
      fetchRootKey: vi.fn().mockResolvedValue(undefined),
    };

    vi.mocked(AuthClient.create).mockResolvedValue(mockAuthClient as any);
    vi.mocked(HttpAgent).mockImplementation(() => mockHttpAgent);

    adapter["authClient"] = await AuthClient.create();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should have a default URL", () => {
    expect(adapter.url).toBe("https://identity.ic0.app");
  });

  it("should initialize the auth client", async () => {
    await adapter["initAuthClient"]();
    expect(adapter["authClient"]).toBeDefined();
  });

  it("should initialize the agent", async () => {
    const identity = adapter["authClient"].getIdentity();
    await adapter["initAgent"](identity, "https://localhost:8000");
    expect(adapter["agent"]).toBeDefined();
    expect(HttpAgent).toHaveBeenCalledWith({
      identity,
      host: "https://localhost:8000",
    });
    expect(mockHttpAgent.fetchRootKey).toHaveBeenCalled();
  });

  it("should check if the wallet is available", async () => {
    const isAvailable = await adapter.isAvailable();
    expect(isAvailable).toBe(true);
  });
});
