import { writable, get } from 'svelte/store';
import { Principal } from '@dfinity/principal';
import { pnpInstance } from './pnp';
import { idlFactory } from '../idls/ksicp_ledger';
import type { _SERVICE } from '../idls/ksicp_ledger/ksicp_ledger.did';

export const balance = writable<bigint | null>(null);

export const fetchBalance = async () => {
  const pnp = get(pnpInstance);
  const account = pnp?.account || (pnp as any)?.connectedAccount;
  if (!account?.owner) return;

  try {
    const actor = pnp.getActor<_SERVICE>({
      canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai", 
      idl: idlFactory,
      anon: true 
    });
    
    const result = await actor.icrc1_balance_of({
      owner: Principal.fromText(account.owner),
      subaccount: [],
    });
    balance.set(result);
    return result;
  } catch (error) {
    console.error('Balance fetch failed:', error);
  }
};
