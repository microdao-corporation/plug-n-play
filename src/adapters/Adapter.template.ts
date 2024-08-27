// src/adapters/Template.template.js

import { AdapterInterface, Account, AdapterConfig, TransferParams } from "./AdapterInterface";

export class TemplateAdapter extends AdapterInterface {
  name: string;
  logo: string;
  readyState: string;
  url: string;
  constructor() {
    super();
    this.name = 'Template';
    this.logo = 'path_to_template_logo.svg';
    this.readyState = "NotDetected";
    this.url = "https://template.com/";
  }

  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getBalance(): Promise<bigint> {
    throw new Error("Method not implemented.");
  }
  transfer(params: TransferParams): Promise<void> {
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

  async connect(config): Promise<Account> {
    return {
      accountId: "",
      principalId: ""
    }
  }
}