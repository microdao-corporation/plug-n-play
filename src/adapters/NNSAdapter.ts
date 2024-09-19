// src/adapters/NNSAdapter.ts

import { Actor, HttpAgent, type ActorSubclass } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import type { Wallet, Adapter } from "../types/index";
import { Principal } from "@dfinity/principal";
import { ICRC1_IDL } from "../did/icrc1.idl.js";
import { principalToSubAccount } from "@dfinity/utils";

export class NNSAdapter implements Adapter.Interface {
  // Required property from Adapter.Interface
  url: string;

  // Internal properties
  private authClient: AuthClient | null;
  private agent: HttpAgent | null;

  constructor() {
    // Set the default identity provider URL for NNS
    this.url = "https://identity.ic0.app";
    this.authClient = null;
    this.agent = null;
  }

  // Checks if the wallet is available
  async isAvailable(): Promise<boolean> {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
    }
    // NNS is always available since it's a web-based identity provider
    return true;
  }

  // Connects to the wallet using the provided configuration
  async connect(config: Wallet.PNPConfig): Promise<Wallet.Account | boolean> {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
    }

    const isAuthenticated = await this.authClient.isAuthenticated();

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
      this.agent = await HttpAgent.create({
        identity,
        host,
      });
      // Fetch the root key in development mode
      if (host.includes("localhost") || host.includes("127.0.0.1")) {
        await this.agent.fetchRootKey();
      }
      return {
        owner: principal,
        subaccount: principalToSubAccount(principal),
      };
    } catch (error) {
      console.error("Error during _continueLogin:", error);
      throw error;
    }
  }

  // Disconnects from the wallet
  async disconnect(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
      this.agent = null;
      this.authClient = null;
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
    if (!this.authClient) {
      throw new Error("AuthClient is not initialized");
    }

    const identity = this.authClient.getIdentity();
    const host = options.host || this.url;
    this.agent = await HttpAgent.create({
      identity,
      host,
    });
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      await this.agent.fetchRootKey();
    }
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