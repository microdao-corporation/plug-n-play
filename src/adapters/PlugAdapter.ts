// src/adapters/PlugAdapter.ts

import { ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Adapter, Wallet } from "../types";
import { ICRC1_IDL } from "../did/icrc1.idl.js";

export class PlugAdapter implements Adapter.Interface {
  name: string = "Plug";
  logo: string = "path_to_plug_logo.svg";
  url: string = "https://plugwallet.ooo/";

  private readyState:
    | "NotDetected"
    | "Installed"
    | "Connected"
    | "Disconnected" = "NotDetected";

  constructor() {
    this.initPlug();
  }

  // Initialize Plug and set readyState accordingly
  private initPlug(): void {
    if (typeof window !== "undefined" && window.ic && window.ic.plug) {
      this.readyState = "Installed";
      window.ic.plug.isConnected().then((connected) => {
        this.readyState = connected ? "Connected" : "Installed";
      });
    } else {
      this.readyState = "NotDetected";
    }
  }

  // Check if the wallet is available
  async isAvailable(): Promise<boolean> {
    return this.readyState !== "NotDetected";
  }

  // Connect to Plug wallet
  async connect(config: Wallet.AdapterConfig): Promise<Wallet.Account> {
    if (this.readyState === "NotDetected") {
      window.open(this.url, "_blank");
      throw new Error("Plug wallet is not available");
    }

    const isConnected = await window.ic!.plug!.isConnected();

    if (!isConnected) {
      try {
        console.log("Connecting to Plug wallet...", config);
        const connected = await window.ic!.plug!.requestConnect({
          whitelist: config.whitelist || [],
          host: config.hostUrl || "https://mainnet.dfinity.network",
          timeout: config.timeout || 1000 * 60 * 60 * 24 * 7,
          onConnectionUpdate: this.handleConnectionUpdate.bind(this),
        });
        if (!connected) {
          throw new Error("User declined the connection request");
        }
        this.readyState = "Connected";
      } catch (e) {
        console.error("Failed to connect to Plug wallet:", e);
        throw e;
      }
    } else {
      this.readyState = "Connected";
    }

    const principal = await this.getPrincipal();
    const accountId = await this.getAccountId();

    return {
      owner: principal,
      subaccount: null,
    };
  }

  // Disconnect from Plug wallet
  async disconnect(): Promise<void> {
    if (window.ic && window.ic.plug && window.ic.plug.disconnect) {
      await window.ic.plug.disconnect();
      this.readyState = "Disconnected";
    } else {
      throw new Error("Plug wallet is not available");
    }
  }

  // Get the user's principal ID
  async getPrincipal(): Promise<Principal> {
    if (window.ic && window.ic.plug && window.ic.plug.principalId) {
      return Principal.fromText(window.ic.plug.principalId);
    } else {
      throw new Error("Plug wallet is not available or principal ID is unavailable");
    }
  }

  // Get the user's account ID
  async getAccountId(): Promise<string> {
    if (window.ic && window.ic.plug && window.ic.plug.accountId) {
      return window.ic.plug.accountId;
    } else {
      throw new Error("Plug wallet is not available or account ID is unavailable");
    }
  }

  // Create an actor to interact with a canister
  async createActor<T>(
    canisterId: string,
    idlFactory: any
  ): Promise<ActorSubclass<T>> {
    if (!canisterId || !idlFactory) {
      throw new Error("Canister ID and IDL factory are required");
    }

    if (window.ic && window.ic.plug && window.ic.plug.createActor) {
      try {
        const actor = await window.ic.plug.createActor<T>({
          canisterId,
          interfaceFactory: idlFactory,
        });
        return actor;
      } catch (e) {
        console.error("Failed to create actor through Plug:", e);
        throw e;
      }
    } else {
      throw new Error("Plug wallet is not available or not connected");
    }
  }

  // Request balance
  async getBalance(): Promise<bigint> {
    if (window.ic && window.ic.plug && window.ic.plug.requestBalance) {
      try {
        const balances = await window.ic.plug.requestBalance();
        const icpBalance = balances.find((b) => b.currency === "ICP");
        return BigInt(icpBalance ? icpBalance.amount : 0);
      } catch (e) {
        console.error("Failed to get balance:", e);
        throw e;
      }
    } else {
      throw new Error("Plug wallet is not available or not connected");
    }
  }

  // Perform an ICRC-1 token transfer
  async icrc1Transfer(
    canisterId: Principal,
    params: Wallet.TransferParams
  ): Promise<void> {
    const actor = await this.createActor<any>(canisterId.toText(), ICRC1_IDL);
    try {
      await actor.icrc1_transfer(params);
    } catch (e) {
      console.error("ICRC-1 transfer failed:", e);
      throw e;
    }
  }

  // Handle connection updates (e.g., account switching)
  private handleConnectionUpdate(): void {
    console.log("Plug connection updated");
    // You can add logic here to handle when the user switches accounts in Plug
  }
}