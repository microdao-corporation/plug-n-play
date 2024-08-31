// src/adapters/NNSAdapter.ts

import { Actor, HttpAgent, type ActorSubclass } from "@dfinity/agent";
import { getAccountIdentifier } from "../utils/identifierUtils.js";
import { AuthClient } from "@dfinity/auth-client";
import { Wallet, Adapter } from "../types/index";
import { Principal } from "@dfinity/principal";
import { ICRC1_IDL } from "../did/icrc1.idl.js";
import { hexStringToUint8Array, principalToSubAccount } from "@dfinity/utils";

export class NNSAdapter implements Adapter.Interface {
  name: string;
  logo: string;
  readyState: string;
  url: string;
  wallets: Wallet.AdapterInfo[];
  private authClient: AuthClient | null;
  private agent: HttpAgent | null;

  constructor() {
    this.name = "NNS";
    this.logo = "path_to_nns_logo.svg";
    this.readyState = "Loadable";
    this.url = "http://localhost:4943"; // Use the correct host in production
    this.authClient = null;
    this.agent = null;
  }
  state: Wallet.WalletState;
  icrc1Metadata(canisterId: string): Promise<any> {
    const actor = Actor.createActor(ICRC1_IDL, {
      agent: this.agent,
      canisterId,
    });
    return actor.icrc1_metadata();
  }
  async requestTransfer(params: Wallet.TransferParams) {
    // not possible with NNS
    throw new Error("Method not implemented.");
  }

  async isAvailable(): Promise<boolean> {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
    }
    return true;
  }

  async connect(config: Wallet.AdapterConfig): Promise<Wallet.Account> {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
    }

    const isConnected = await this.authClient.isAuthenticated();

    if (!isConnected) {
      return new Promise<Wallet.Account>((resolve, reject) => {
        this.authClient!.login({
          identityProvider: config.identityProvider || this.url,
          onSuccess: async () => {
            try {
              const result = await this._continueLogin(config.host || this.url);
              resolve(result);
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
      return this._continueLogin(config.host || this.url);
    }
  }

  private async _continueLogin(host: string): Promise<Wallet.Account> {
    try {
      const identity = this.authClient!.getIdentity();
      const principal = identity.getPrincipal();
      this.agent = HttpAgent.createSync({
        identity,
        host,
      });
      // Fetch the root key in development mode
      if (this.url.includes("localhost") || this.url.includes("127.0.0.1")) {
        await this.agent.fetchRootKey();
      }
      return {
        subaccount: principalToSubAccount(principal),
        owner: principal || null,
      };
    } catch (error) {
      console.error("Error during _continueLogin:", error);
      throw error;
    }
  }

  async icrc1BalanceOf(
    canisterId: string,
    account: Wallet.Account
  ): Promise<BigInt> {
    if (!this.agent) {
      throw new Error(
        "Agent is not initialized. Ensure the wallet is connected."
      );
    }
    const actor = Actor.createActor(ICRC1_IDL, {
      agent: this.agent,
      canisterId,
    });
    return (await actor.icrc1_balance_of(account)) as BigInt;
  }

  async disconnect(): Promise<void> {
    if (this.authClient) {
      this.readyState = "Loadable";
      this.agent = null;
      await this.authClient.logout();
      this.authClient = null;
    }
  }

  async createActor<T>(
    canisterId: string,
    idl: any
  ): Promise<ActorSubclass<T>> {
    if (!canisterId || !idl) {
      throw new Error("Canister ID and Interface Factory are required");
    }

    if (!this.agent) {
      throw new Error(
        "Agent is not initialized. Ensure the wallet is connected."
      );
    }

    return Actor.createActor(idl, { agent: this.agent, canisterId });
  }

  async createAgent(options?: {
    whitelist: string[];
    host?: string;
  }): Promise<void> {
    if (!this.authClient) {
      throw new Error("AuthClient is not initialized");
    }
    const identity = this.authClient.getIdentity();
    const agent = HttpAgent.createSync({ identity, host: options.host });
    if (this.url.includes("localhost") || this.url.includes("127.0.0.1")) {
      await agent.fetchRootKey();
    }
  }

  async getAccountId(): Promise<string | null> {
    if (!this.authClient || !this.agent) {
      throw new Error("Wallet is not connected or initialized");
    }
    const identity = this.authClient.getIdentity();
    const principal = await identity.getPrincipal();
    const accountId = getAccountIdentifier(principal.toString());
    return accountId !== false ? accountId : null;
  }

  async getPrincipal(): Promise<Principal | null> {
    if (!this.authClient) {
      throw new Error("AuthClient is not initialized");
    }
    const identity = this.authClient.getIdentity();
    return identity.getPrincipal();
  }

  async getBalance(): Promise<bigint> {
    throw new Error("Method not implemented.");
  }

  async icrc1Transfer(
    canisterId: Principal,
    params: Wallet.TransferParams
  ): Promise<void> {
    const icrcActor = Actor.createActor(ICRC1_IDL, {
      agent: this.agent,
      canisterId: canisterId,
    });
    await icrcActor.icrc1_transfer(params);
  }

  async whoAmI(): Promise<Principal | null> {
    if (!this.authClient || !this.agent) {
      console.warn("NNS wallet is not connected or initialized");
    }
    const identity = this.authClient.getIdentity();
    return identity.getPrincipal();
  }

  async isConnected(): Promise<boolean> {
    return (await this.authClient?.isAuthenticated()) ?? false;
  }
}
