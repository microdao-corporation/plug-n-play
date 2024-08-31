import { createPnP, walletsList } from './pnp';
import { BatchTransact } from './utils/batchTransact';
import { getAccountIdentifier } from './utils/identifierUtils.js';
declare const principalIdFromHex: (principalId: string, subAccount?: string | number) => string | false;
declare function getPnPAdapter(): ReturnType<typeof createPnP>;
export { createPnP, walletsList, BatchTransact, principalIdFromHex, getAccountIdentifier, getPnPAdapter };
