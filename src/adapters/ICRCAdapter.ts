import { ActorSubclass } from "@dfinity/agent";
import { ICRC } from '../../types';

// Generic ICRC Adapter
class GenericICRCAdapter implements ICRC.Adapter {
  protected standards: ICRC.Standard[] = [];
  protected walletAdapter: any;

  constructor(walletAdapter: any) {
    this.walletAdapter = walletAdapter;
  }

  async getSupportedStandards(): Promise<ICRC.Standard[]> {
    return this.standards;
  }

  // Common methods that might be shared across ICRC standards
  async isAvailable(): Promise<boolean> {
    return this.walletAdapter.isAvailable();
  }

  async connect(config: any): Promise<any> {
    return this.walletAdapter.connect(config);
  }

  async disconnect(): Promise<void> {
    return this.walletAdapter.disconnect();
  }

  async createActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>> {
    return this.walletAdapter.createActor(canisterId, idl);
  }

  async transfer(params: any): Promise<any> {
    return this.walletAdapter.transfer(params);
  }
}
