// src/adapters/NNSAdapter.ts

import { Actor, HttpAgent, type ActorSubclass, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import type { Wallet, Adapter } from "../types/index";
import { Principal } from "@dfinity/principal";
import { ICRC1_IDL } from "../did/icrc1.idl.js";
import { principalToSubAccount } from "@dfinity/utils";

export class NNSAdapter implements Adapter.Interface {
  // Required property from Adapter.Interface
  url: string;
  config: Wallet.PNPConfig;

  // Internal properties
  private authClient: AuthClient | null = null;
  private agent: HttpAgent | null = null;

  constructor() {
    this.url = "https://identity.ic0.app";
  }

  // Helper method to initialize the AuthClient
  private async initAuthClient(): Promise<void> {
    if (!this.authClient) {
      this.authClient = await AuthClient.create({
        idleOptions: {
          idleTimeout: this.config.timeout || 1000 * 60 * 60 * 24 * 7, // 7 days
          disableDefaultIdleCallback: true, // Disable default reload behavior
        },
      });
      this.authClient.idleManager?.registerCallback?.(() => this.refreshLogin());
    }
  }

  // Helper method to initialize the HttpAgent
  private async initAgent(identity: Identity, host: string): Promise<void> {
    this.agent = new HttpAgent({
      identity,
      host,
    });
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      try {
        await this.agent.fetchRootKey();
      } catch (e) {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        console.error(e);
      }
    }
  }

  // Checks if the wallet is available
  async isAvailable(): Promise<boolean> {
    // NNS is always available since it's a web-based identity provider
    return true;
  }

  // Connects to the wallet using the provided configuration
  async connect(config: Wallet.PNPConfig): Promise<Wallet.Account> {
    this.config = config;
    await this.initAuthClient();

    const isAuthenticated = await this.authClient!.isAuthenticated();

    if (!isAuthenticated) {
      return new Promise<Wallet.Account>((resolve, reject) => {
        this.authClient!.login({
          identityProvider: config.identityProvider || this.url,
          onSuccess: async () => {
            try {
              const account = await this._continueLogin(config.hostUrl || this.url);
              resolve(account);
            } catch (error) {
              reject(error);
            }
          },
          onError: (error) => {
            reject(new Error("Authentication failed: " + error));
          },
        });
      });
    } else {
      // User is already authenticated, proceed with login
      return this._continueLogin(config.hostUrl || this.url);
    }
  }

  private async _continueLogin(host: string): Promise<Wallet.Account> {
    try {
      const identity = this.authClient!.getIdentity();
      const principal = identity.getPrincipal();
      await this.initAgent(identity, host);
      return {
        owner: principal,
        subaccount: principalToSubAccount(principal),
      };
    } catch (error) {
      console.error("Error during _continueLogin:", error);
      throw error;
    }
  }

  private async refreshLogin(): Promise<void> {
    try {
      // Re-authenticate the user
      await this.authClient!.login({
        onSuccess: async () => {
          const identity = this.authClient!.getIdentity();
          await this.initAgent(identity, this.url);
        },
        onError: (error) => {
          console.error("Error during refreshLogin:", error);
          throw error;
        },
      });
    } catch (error) {
      console.error("Error during refreshLogin:", error);
      throw error;
    }
  }

  // Disconnects from the wallet
  async disconnect(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
      this.agent = null;
      this.authClient = null;
      this.config = {};
    }
  }

  // Creates an actor for a canister with the specified IDL
  async createActor<T>(
    canisterId: string,
    idl: any
  ): Promise<ActorSubclass<T>> {
    if (!canisterId || !idl) {
      throw new Error("Canister ID and IDL are required");
    }

    if (!this.agent) {
      throw new Error("Agent is not initialized. Ensure the wallet is connected.");
    }

    return Actor.createActor<T>(idl, { agent: this.agent, canisterId });
  }

  // Creates an agent for communication with the Internet Computer
  async createAgent(options: { whitelist?: string[]; host?: string }): Promise<void> {
    await this.initAuthClient();
    const identity = this.authClient!.getIdentity();
    const host = options.host || this.url;
    await this.initAgent(identity, host);
  }

  // Retrieves the ICRC-1 token balance of the specified account
  async icrc1BalanceOf(
    canisterId: string,
    account: Wallet.Account
  ): Promise<bigint> {
    if (!this.agent) {
      throw new Error("Agent is not initialized. Ensure the wallet is connected.");
    }
    const actor = Actor.createActor(ICRC1_IDL, {
      agent: this.agent,
      canisterId,
    });
    const balance = await actor.icrc1_balance_of(account);
    return balance as bigint;
  }

  // Performs a transfer of ICRC-1 tokens
  async icrc1Transfer(
    canisterId: Principal | string,
    params: Wallet.TransferParams
  ): Promise<any> {
    if (!this.agent) {
      throw new Error("Agent is not initialized. Ensure the wallet is connected.");
    }
    const actor = Actor.createActor(ICRC1_IDL, {
      agent: this.agent,
      canisterId: typeof canisterId === "string" ? canisterId : canisterId.toText(),
    });
    return actor.icrc1_transfer(params);
  }
}