/**
 * Type definitions for Ledger adapter
 */

import type { CallRequest, ReadRequest } from "@dfinity/agent";

/**
 * Extended request types with proper typing
 */
export interface LedgerCallRequest extends CallRequest {
  request_type: 'call';
  method_name: string;
  canister_id: { toString(): string };
  arg?: ArrayBuffer;
}

export interface LedgerReadRequest extends ReadRequest {
  request_type: 'read_state';
}

export type LedgerRequest = LedgerCallRequest | LedgerReadRequest;

/**
 * Helper type guards
 */
export function isCallRequest(request: LedgerRequest): request is LedgerCallRequest {
  return request.request_type === 'call';
}

export function isReadRequest(request: LedgerRequest): request is LedgerReadRequest {
  return request.request_type === 'read_state';
}

export function isTransferRequest(request: LedgerRequest): boolean {
  if (!isCallRequest(request)) return false;
  return request.method_name === 'icrc1_transfer' || request.method_name === 'transfer';
}