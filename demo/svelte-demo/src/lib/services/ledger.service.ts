import { Principal } from '@dfinity/principal';
import { idlFactory } from '../idls/ksicp_ledger';
import type { _SERVICE } from '../idls/ksicp_ledger/ksicp_ledger.did';
import { PNPService } from './pnp.service';

const LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
const ICP_TRANSFER_FEE = 10000n; // 0.0001 ICP

export class LedgerService {
  static async getBalance(principalId: string): Promise<bigint> {
    const pnp = PNPService.getInstance();
    if (!pnp) throw new Error('PNP not initialized');

    // getActor is synchronous
    const actor = pnp.getActor<_SERVICE>({
      canisterId: LEDGER_CANISTER_ID,
      idl: idlFactory,
      anon: true
    });

    const result = await actor.icrc1_balance_of({
      owner: Principal.fromText(principalId),
      subaccount: [],
    });

    return result;
  }

  static async transfer(to: string, amount: bigint): Promise<bigint> {
    const pnp = PNPService.getInstance();
    if (!pnp) throw new Error('PNP not initialized');

    // Check if user is authenticated
    const isAuthenticated = await pnp.isAuthenticated();
    if (!isAuthenticated) {
      throw new Error('Please connect your wallet first');
    }

    try {
      // WORKAROUND: The PNP library has an issue with authenticated actors
      // Instead of using getActor with anon: false, we'll try to get the provider directly
      const provider = (pnp as any).connectionManager?.provider;

      let actor: any;

      if (provider && provider.createActor) {
        // Use the provider's createActor method directly
        console.log('Using provider createActor for:', provider.constructor.name);
        actor = provider.createActor(LEDGER_CANISTER_ID, idlFactory, { requiresSigning: true });
      } else {
        // Fallback to PNP's getActor
        console.log('Falling back to PNP getActor');
        actor = pnp.getActor<_SERVICE>({
          canisterId: LEDGER_CANISTER_ID,
          idl: idlFactory,
          anon: false
        });
      }

      if (!actor) {
        throw new Error('Failed to create authenticated actor. Please reconnect your wallet.');
      }

      console.log('Actor created successfully');

      const result = await actor.icrc1_transfer({
        to: {
          owner: Principal.fromText(to),
          subaccount: [],
        },
        amount: amount,
        fee: [ICP_TRANSFER_FEE],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
      });

      if ('Ok' in result) {
        return result.Ok;
      } else {
        const error = 'Err' in result ? JSON.stringify(result.Err) : 'Unknown error';
        throw new Error(`Transfer failed: ${error}`);
      }
    } catch (err) {
      console.error('Transfer error details:', err);
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error('Transfer failed: ' + String(err));
      }
    }
  }

  static formatICP(balance: bigint | null): string {
    if (balance === null) return '...';
    const s = balance.toString().padStart(9, '0');
    const i = s.slice(0, -8) || '0';
    const d = s.slice(-8).replace(/0+$/, '');
    return d ? `${i}.${d}` : i;
  }

  static parseICP(value: string): bigint {
    // Remove any whitespace and validate
    const cleaned = value.trim();
    if (!cleaned || !/^\d*\.?\d*$/.test(cleaned)) {
      throw new Error('Invalid ICP amount');
    }

    // Split into integer and decimal parts
    const parts = cleaned.split('.');
    const integerPart = parts[0] || '0';
    let decimalPart = parts[1] || '';

    // Pad or truncate decimal to 8 digits
    decimalPart = decimalPart.padEnd(8, '0').slice(0, 8);

    // Combine and convert to bigint (e8s format)
    const e8s = integerPart + decimalPart;
    return BigInt(e8s);
  }

  static get transferFee(): bigint {
    return ICP_TRANSFER_FEE;
  }
}