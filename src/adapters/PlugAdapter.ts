// src/adapters/PlugAdapter.ts

import { Actor, type ActorSubclass } from '@dfinity/agent';
import { Wallet } from '../../types/index';
import { Principal } from '@dfinity/principal';
import { getAccountIdentifier } from '../utils/identifierUtils';
import { hexStringToUint8Array } from '@dfinity/utils';
import { ICRC1_IDL } from '../did/icrc1.idl.js';

export class PlugAdapter implements Wallet.PlugInterface {
  name: string;
  logo: string;
  readyState: string;
  url: string;

  constructor() {
    this.name = 'Plug';
    this.logo = 'path_to_plug_logo.svg';
    this.readyState = "NotDetected";
    this.url = "https://plugwallet.ooo/";
  }

  async isAvailable(): Promise<boolean> {
    return !!(window.ic && window.ic.plug);
  }

  async requestConnect(params: any): Promise<any> {
    if (!await this.isAvailable()) {
      this.readyState = "NotDetected";
      window.open(this.url, "_blank");
      throw new Error("Plug wallet is not available");
    }

    try {
      const publicKey = await window.ic!.plug!.requestConnect(params);
      this.readyState = "Connected";
      return publicKey;
    } catch (error) {
      console.error("Error connecting to Plug wallet:", error);
      throw error;
    }
  }

  async isConnected(): Promise<boolean> {
    return await window.ic!.plug!.isConnected();
  }

  async createActor<T>(options: { canisterId: string; interfaceFactory: any; }): Promise<ActorSubclass<T>> {
    return window.ic!.plug!.createActor(options);
  }

  async requestBalance(): Promise<Array<{ amount: number, currency: string, image: string, name: string, value: number }>> {
    return window.ic!.plug!.requestBalance();
  }

  async requestTransfer(params: Wallet.TransferParams): Promise<{ height: number }> {
    return window.ic!.plug!.requestTransfer(params);
  }

  async requestTransferToken(params: any): Promise<any> {
    return window.ic!.plug!.requestTransferToken(params);
  }

  async requestBurnXTC(params: { to: string, amount: number }): Promise<any> {
    return window.ic!.plug!.requestBurnXTC(params);
  }

  async batchTransactions(transactions: Wallet.Transaction.Item[]): Promise<any> {
    return window.ic!.plug!.batchTransactions(transactions);
  }

  async createAgent(options?: { whitelist: string[], host?: string }): Promise<void> {
    return window.ic!.plug!.createAgent(options);
  }

  async disconnect(): Promise<void> {
    await window.ic!.plug!.disconnect();
    this.readyState = "Disconnected";
  }

  getAccountId(): string {
    return getAccountIdentifier(this.getPrincipal().toString()) as string;
  }

  getPrincipal(): Principal {
    return window.ic!.plug!.getPrincipal();
  }


  // Additional methods to satisfy Adapter.Interface
  async connect(config: Wallet.AdapterConfig): Promise<Wallet.Account> {
    const publicKey = await this.requestConnect(config);
    const principal = this.getPrincipal();
    const accountId = this.getAccountId();

    return {
      subaccount: hexStringToUint8Array(accountId),
      owner: principal,
    };
  }

  async getBalance(): Promise<bigint> {
    const balances = await this.requestBalance();
    const icpBalance = balances.find(b => b.currency === 'ICP');
    return BigInt(icpBalance ? icpBalance.amount : 0);
  }

  async icrc1_transfer(canisterId: Principal, params: Wallet.TransferParams): Promise<void> {
    const icrcActor = this.createActor({
      canisterId: canisterId.toString(),
      interfaceFactory: ICRC1_IDL
    }
    );
    await icrcActor.icrc1_transfer(canisterId, params);
  }

  async whoAmI(): Promise<Principal> {
    return this.getPrincipal();
  }
}

if(typeof window !== 'undefined') {
// Initialize Plug if it's available
if (window.ic && window.ic.plug) {
  (window.ic.plug as any).init();
}

// Add event listener for when the page is fully loaded
window.addEventListener("load", () => {
  if (window.ic && window.ic.plug) {
    (PlugAdapter.prototype as any).readyState = "Installed";
  }
});
}