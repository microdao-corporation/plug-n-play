// src/adapters/Template.template.js
import { Principal } from '@dfinity/principal';
import { Wallet, Adapter } from '../../types/index';

export class TemplateAdapter extends Adapter.Interface {
  icrc1_transfer(canisterId: any, params: Wallet.TransferParams): Promise<void> {
    throw new Error('Method not implemented.');
  }
  icrc1BalanceOf(canisterId: Principal, account?: Wallet.Account): Promise<BigInt> {
    throw new Error('Method not implemented.');
  }
  name: string;
  logo: string;
  readyState: string;
  url: string = '';

  constructor() {
      const url = ''; // Add a default value for the 'url' property
      super(url);
      this.url = url;
      this.name = 'Template';
      this.logo = 'path_to_template_logo.svg';
      this.readyState = "NotDetected";
  }

  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getBalance(): Promise<bigint> {
    throw new Error("Method not implemented.");
  }
  requestTransfer: (params: Wallet.TransferParams) => Promise<void> = async (params) => {
    throw new Error("Method not implemented.");
  }

  transfer(params: Wallet.TransferParams): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createActor<T>(canisterId: string, idl: any): Promise<T> {
    throw new Error("Method not implemented.");
  }
  getAccountId(): Promise<string | null> {
    throw new Error("Method not implemented.");
  }
  getPrincipal(): Promise<Principal | null> {
    throw new Error("Method not implemented.");
  }
  isConnected(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  whoAmI(): Promise<Principal | null> {
    throw new Error("Method not implemented.");
  }
  async isAvailable(): Promise<boolean> {
    return false;
  }

  async connect(_config: Wallet.AdapterConfig): Promise<Wallet.Account> {
    return {
      subaccount: null,
      owner: null
    }
  }
}