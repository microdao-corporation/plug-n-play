// src/adapters/Template.template.js
import { Wallet } from '../../types';

export class TemplateAdapter extends Wallet.AdapterInterface {
  name: string;
  logo: string;
  readyState: string;
  url: string;
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
  transfer(params: Wallet.TransferParams): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createActor<T>(canisterId: string, idl: any): Promise<T> {
    throw new Error("Method not implemented.");
  }
  getAccountId(): Promise<string | boolean> {
    throw new Error("Method not implemented.");
  }
  getPrincipal(): Promise<string | boolean> {
    throw new Error("Method not implemented.");
  }
  isConnected(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  whoAmI(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async isAvailable(): Promise<boolean> {
    return false;
  }

  async connect(_config: Wallet.AdapterConfig): Promise<Wallet.Account> {
    return {
      accountId: "",
      principalId: ""
    }
  }
}