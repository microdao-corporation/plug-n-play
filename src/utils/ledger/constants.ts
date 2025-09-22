/**
 * Ledger hardware wallet constants and defaults
 */

// Ledger app return codes
export const LEDGER_RETURN_CODE = {
  SUCCESS: 0x9000,
  USER_REJECTED: 0x6985,
  INCORRECT_DATA: 0x6A80,
  APP_NOT_OPEN: 0x6511,
} as const;

// Default configuration
export const LEDGER_DEFAULTS = {
  DERIVE_PATH: "m/44'/223'/0'/0/0", // Standard IC derivation path
  TRANSPORT: 'WebHID' as const,
  TRANSPORT_TIMEOUT: 60000, // 60 seconds
} as const;

// DER signature constants
export const DER_SIGNATURE = {
  SEQUENCE_TAG: 0x30,
  INTEGER_TAG: 0x02,
  SIGNATURE_LENGTH: 64, // Raw signature length (32 bytes r + 32 bytes s)
  COMPONENT_LENGTH: 32, // Length of r and s components
} as const;

// Transaction types
export const LEDGER_TX_TYPE = {
  DEFAULT: 0x00,
  STAKE: 0x01,
} as const;