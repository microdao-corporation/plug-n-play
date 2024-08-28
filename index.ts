import { AnonymousIdentity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import PnP from './src';
import { BatchTransact } from "./src/utils/batchTransact";
import { getAccountIdentifier } from './src/utils/identifierUtils.js';
import { HOSTURL, NNS_CANISTER_ID } from './src/constants';
import { Wallet } from './types';

const principalIdFromHex = getAccountIdentifier;
const PnPAdapter = new PnP({
  whitelist: [NNS_CANISTER_ID],
  host: HOSTURL,
  identityProvider: "",
});

if (typeof window !== 'undefined') {
  window.pnp = {
    PnP,  // Assign the PnP class itself
    BatchTransact,
    nns: { AnonymousIdentity, Principal },
  } as Wallet.PnPWindow;  // Type assertion to ensure it matches the Wallet.PnPWindow type
}

export { PnP, BatchTransact, principalIdFromHex, getAccountIdentifier, PnPAdapter };
