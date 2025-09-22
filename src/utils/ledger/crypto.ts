/**
 * Cryptographic utilities for Ledger hardware wallet
 */

import { Buffer } from "buffer";
import { DER_SIGNATURE } from "./constants";

/**
 * Convert DER-encoded signature to raw 64-byte format
 * IC expects raw r||s format, not DER encoding
 *
 * @param derSignature - DER-encoded signature from Ledger
 * @returns Raw 64-byte signature (32 bytes r + 32 bytes s)
 */
export function derToRaw(derSignature: Buffer): Buffer {
  // DER format: 0x30 [total-length] 0x02 [r-length] [r] 0x02 [s-length] [s]
  let offset = 0;

  // Check for DER sequence tag (0x30)
  if (derSignature[offset++] !== DER_SIGNATURE.SEQUENCE_TAG) {
    throw new Error('Invalid DER signature: missing sequence tag');
  }

  // Skip total length
  offset++; // Skip total length byte

  // Check for INTEGER tag for r (0x02)
  if (derSignature[offset++] !== DER_SIGNATURE.INTEGER_TAG) {
    throw new Error('Invalid DER signature: missing r INTEGER tag');
  }

  // Get r length and value
  const rLength = derSignature[offset++];
  const r = derSignature.subarray(offset, offset + rLength);
  offset += rLength;

  // Check for INTEGER tag for s (0x02)
  if (derSignature[offset++] !== DER_SIGNATURE.INTEGER_TAG) {
    throw new Error('Invalid DER signature: missing s INTEGER tag');
  }

  // Get s length and value
  const sLength = derSignature[offset++];
  const s = derSignature.subarray(offset, offset + sLength);

  // Remove leading zeros and pad to 32 bytes
  const rPadded = padComponent(r);
  const sPadded = padComponent(s);

  // Concatenate r and s for raw 64-byte signature
  return Buffer.concat([rPadded, sPadded]);
}

/**
 * Pad a signature component to exactly 32 bytes
 * Removes leading zeros from DER encoding and pads as needed
 *
 * @param component - The r or s component from DER signature
 * @returns 32-byte padded component
 */
function padComponent(component: Buffer): Buffer {
  // Remove leading zero if present (DER encoding for positive numbers)
  const trimmed = component[0] === 0 ? component.subarray(1) : component;

  // Pad to 32 bytes if necessary
  if (trimmed.length === DER_SIGNATURE.COMPONENT_LENGTH) {
    return trimmed;
  }

  if (trimmed.length < DER_SIGNATURE.COMPONENT_LENGTH) {
    // Pad with leading zeros
    return Buffer.concat([
      Buffer.alloc(DER_SIGNATURE.COMPONENT_LENGTH - trimmed.length),
      trimmed
    ]);
  }

  // Take last 32 bytes if somehow longer
  return trimmed.subarray(-DER_SIGNATURE.COMPONENT_LENGTH);
}