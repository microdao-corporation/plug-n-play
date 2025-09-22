/**
 * Type definitions for Ledger adapter
 */

import type { CallRequest, ReadRequest } from "@dfinity/agent";

/**
 * Extended request types with proper typing
 * Using intersection types to add properties while maintaining compatibility
 */
export type LedgerCallRequest = CallRequest & {
  method_name: string;
  canister_id: { toString(): string };
  arg?: ArrayBuffer;
}

export type LedgerReadRequest = ReadRequest;

export type LedgerRequest = LedgerCallRequest | LedgerReadRequest;

/**
 * Helper type guards
 */
export function isCallRequest(request: LedgerRequest): request is LedgerCallRequest {
  return 'method_name' in request && 'canister_id' in request;
}

export function isReadRequest(request: LedgerRequest): request is LedgerReadRequest {
  // Check if it's not a call request - then it must be a read request
  return !isCallRequest(request);
}

export function isTransferRequest(request: LedgerRequest): boolean {
  if (!isCallRequest(request)) return false;
  return request.method_name === 'icrc1_transfer' || request.method_name === 'transfer';
}