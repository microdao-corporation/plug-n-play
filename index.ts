import { AnonymousIdentity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { createPnP, walletsList } from './src';
import { BatchTransact } from "./src/utils/batchTransact";
import { getAccountIdentifier } from './src/utils/identifierUtils.js';
import { HOSTURL, NNS_CANISTER_ID } from './src/constants';
import { Wallet } from './types';

const principalIdFromHex = getAccountIdentifier;

// Function to create a PnP instance
function createPnPAdapter() {
  return createPnP({
    whitelist: [NNS_CANISTER_ID],
    host: HOSTURL,
    identityProvider: "",
  });
}

// Create the PnP instance only when needed
let PnPAdapter: ReturnType<typeof createPnP> | null = null;

// Function to get or create the PnP instance
function getPnPAdapter(): ReturnType<typeof createPnP> {
  if (!PnPAdapter) {
    PnPAdapter = createPnPAdapter();
  }
  return PnPAdapter;
}

if (typeof window !== 'undefined') {
  window.pnp = {
    PnP: { create: createPnP },  // Provide a 'create' method to instantiate PnP
    BatchTransact,
    nns: { AnonymousIdentity, Principal },
    getPnPAdapter, // Add the function to get the PnP instance
  } as Wallet.PnPWindow;
}

export { createPnP, walletsList, BatchTransact, principalIdFromHex, getAccountIdentifier, getPnPAdapter };