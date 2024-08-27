import { AdapterInterface, Account, AdapterConfig, TransferParams } from './AdapterInterface';
import { ActorSubclass } from '@dfinity/agent';

// Define the shape of the ic.plug object
interface ICPlug {
  isConnected: () => Promise<boolean>;
  requestConnect: (options: {
    whitelist: string[];
    host: string;
    timeout?: number;
    onConnectionUpdate: () => void;
  }) => Promise<string>;
  createAgent: (options: { whitelist: string[]; host: string }) => Promise<void>;
  agent: {
    getPrincipal: () => Promise<{ toString: () => string }>;
  };
  accountId: string;
  disconnect: () => Promise<void>;
  requestTransfer: (params: TransferParams) => Promise<any>;
  createActor: (options: { canisterId: string; interfaceFactory: any }) => Promise<ActorSubclass<any>>;
  principalId: string;
  requestTransferToken: (params: any) => Promise<any>;
  requestBurnXTC: (params: any) => Promise<any>;
  batchTransactions: (transactions: any[]) => Promise<any>;
}

// Extend the global Window interface
declare global {
  interface Window {
    ic?: {
      plug?: ICPlug;
    };
  }
}

export class PlugAdapter extends AdapterInterface {
  getBalance(): Promise<bigint> {
    throw new Error('Method not implemented.');
  }
  async isConnected(): Promise<boolean> {
    return await window.ic!.plug!.isConnected()
  }
  whoAmI(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  name: string;
  logo: string;
  readyState: string;
  url: string;

  constructor() {
    super();
    this.name = 'Plug';
    this.logo = 'path_to_plug_logo.svg';
    this.readyState = "NotDetected";
    this.url = "https://plugwallet.ooo/";
  }

  async isAvailable(): Promise<boolean> {
    return !!(window.ic && window.ic.plug);
  }

  async connect(config: AdapterConfig): Promise<Account> {
    if (!await this.isAvailable()) {
      this.readyState = "NotDetected";
      window.open(this.url, "_blank");
      throw new Error("Plug wallet is not available");
    }

    try {
      const isConnected = await window.ic!.plug!.isConnected();

      if (!isConnected) {
        const publicKey = await window.ic!.plug!.requestConnect({
          whitelist: config.whitelist || [],
          host: config.host || '',
          timeout: config.timeout || 120000,
          onConnectionUpdate: () => {
            console.log("Connection updated");
          },
        });

        if (!publicKey) {
          throw new Error("Failed to connect to Plug wallet");
        }
      }

      await window.ic!.plug!.createAgent({
        whitelist: config.whitelist || [],
        host: config.host || '',
      });

      const principal = await window.ic!.plug!.agent.getPrincipal();
      const accountId = window.ic!.plug!.accountId;

      this.readyState = "Installed";

      return {
        accountId: accountId,
        principalId: principal.toString(),
      };
    } catch (error) {
      console.error("Error connecting to Plug wallet:", error);
      throw error; // Re-throw the error instead of returning false
    }
  }

  async disconnect(): Promise<void> {
    if (window.ic && window.ic.plug && window.ic.plug.disconnect) {
      await window.ic.plug.disconnect();
    }
  }

  async transfer(params: TransferParams): Promise<any> {
    if (!window.ic || !window.ic.plug) {
      throw new Error("Plug wallet is not installed or initialized");
    }
    return window.ic.plug.requestTransfer(params);
  }

  async createActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>> {
    if (!window.ic || !window.ic.plug) {
      throw new Error("Plug wallet is not installed or initialized");
    }
    return window.ic.plug.createActor({
      canisterId,
      interfaceFactory: idl,
    });
  }

  async getAccountId(): Promise<string> {
    if (!window.ic || !window.ic.plug) {
      throw new Error("Plug wallet is not installed or initialized");
    }
    return window.ic.plug.accountId;
  }

  async getPrincipal(): Promise<string> {
    if (!window.ic || !window.ic.plug) {
      throw new Error("Plug wallet is not installed or initialized");
    }
    return window.ic.plug.principalId;
  }

  // Additional methods specific to Plug wallet
  async requestTransferToken(params: any): Promise<any> {
    if (!window.ic || !window.ic.plug) {
      throw new Error("Plug wallet is not installed or initialized");
    }
    return window.ic.plug.requestTransferToken(params);
  }

  async requestBurnXTC(params: any): Promise<any> {
    if (!window.ic || !window.ic.plug) {
      throw new Error("Plug wallet is not installed or initialized");
    }
    return window.ic.plug.requestBurnXTC(params);
  }

  async batchTransactions(transactions: any[]): Promise<any> {
    if (!window.ic || !window.ic.plug) {
      throw new Error("Plug wallet is not installed or initialized");
    }
    return window.ic.plug.batchTransactions(transactions);
  }
}

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