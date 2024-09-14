import { createPNP, walletsList } from './pnp';
import { BatchTransact } from './utils/batchTransact';
import { getAccountIdentifier } from './utils/identifierUtils.js';
declare const principalIdFromHex: (principalId: string, subAccount?: string | number) => string | false;
declare function getPNPAdapter(): ReturnType<typeof createPNP>;
export { createPNP, walletsList, BatchTransact, principalIdFromHex, getAccountIdentifier, getPNPAdapter };
