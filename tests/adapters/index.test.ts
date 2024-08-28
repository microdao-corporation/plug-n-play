import { describe, it, expect } from 'vitest';
import { walletList, NNSAdapter, PlugAdapter } from '../../src/adapters/index';
import dfinityLogo from "../../assets/dfinity.svg";
import plugLogo from "../../assets/plug.jpg";

describe('src/adapters/index.ts', () => {

  it('should export walletList with correct information', () => {
    expect(walletList).toBeDefined();
    expect(walletList).toHaveLength(2);  // We expect 2 wallets

    // Test the first wallet (NNSAdapter)
    const nnsWallet = walletList.find(wallet => wallet.id === 'nns');
    expect(nnsWallet).toBeDefined();
    expect(nnsWallet?.name).toBe('Internet Identity');
    expect(nnsWallet?.icon).toBe(dfinityLogo);
    expect(nnsWallet?.adapter).toBe(NNSAdapter);

    // Test the second wallet (PlugAdapter)
    const plugWallet = walletList.find(wallet => wallet.id === 'plug');
    expect(plugWallet).toBeDefined();
    expect(plugWallet?.name).toBe('Plug Wallet');
    expect(plugWallet?.icon).toBe(plugLogo);
    expect(plugWallet?.adapter).toBe(PlugAdapter);
  });

  it('should export NNSAdapter', () => {
    expect(NNSAdapter).toBeDefined();
  });

  it('should export PlugAdapter', () => {
    expect(PlugAdapter).toBeDefined();
  });

});
