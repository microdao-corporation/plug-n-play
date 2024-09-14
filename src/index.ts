import { AnonymousIdentity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { createPNP, walletsList } from './pnp';
import { BatchTransact } from "./utils/batchTransact";
import { getAccountIdentifier } from './utils/identifierUtils.js';
import { HOSTURL, NNS_CANISTER_ID } from './constants';

const principalIdFromHex = getAccountIdentifier;

// Create the PNP instance only when needed
let PNPAdapter: ReturnType<typeof createPNP> | null = null;

function getPNPAdapter(): ReturnType<typeof createPNP> {
  if (!PNPAdapter) {
    PNPAdapter = createPNP({
      whitelist: [NNS_CANISTER_ID],
      host: HOSTURL,
      identityProvider: "",
    });
  }
  return PNPAdapter;
}

if (typeof window !== 'undefined') {
  (window as any).pnp = {
    PNP: createPNP,
    BatchTransact,
    nns: { AnonymousIdentity, Principal },
    getPNPAdapter,
  };
}

export { createPNP, walletsList, BatchTransact, principalIdFromHex, getAccountIdentifier, getPNPAdapter };