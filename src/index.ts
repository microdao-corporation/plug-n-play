import { AnonymousIdentity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { createPnP, walletsList } from './pnp';
import { BatchTransact } from "./utils/batchTransact";
import { getAccountIdentifier } from './utils/identifierUtils.js';
import { HOSTURL, NNS_CANISTER_ID } from './constants';

const principalIdFromHex = getAccountIdentifier;

// Create the PnP instance only when needed
let PnPAdapter: ReturnType<typeof createPnP> | null = null;

function getPnPAdapter(): ReturnType<typeof createPnP> {
  if (!PnPAdapter) {
    PnPAdapter = createPnP({
      whitelist: [NNS_CANISTER_ID],
      host: HOSTURL,
      identityProvider: "",
    });
  }
  return PnPAdapter;
}

if (typeof window !== 'undefined') {
  (window as any).pnp = {
    PnP: createPnP,
    BatchTransact,
    nns: { AnonymousIdentity, Principal },
    getPnPAdapter,
  };
}

export { createPnP, walletsList, BatchTransact, principalIdFromHex, getAccountIdentifier, getPnPAdapter };