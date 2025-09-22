# Ledger Adapter Update: Using signBls for Update Calls with ICRC-21 Support

## Overview
The Ledger adapter has been updated to use the `signBls` method instead of `signUpdateCall` for non-transfer update calls. This change improves compatibility with the latest Ledger IC app and adds support for ICRC-21 consent messages.

## Key Implementation Details

The `signBls` method expects three hex-encoded parameters:

1. **consent_request**: ICRC-21 consent message (when available) or '00' as placeholder
2. **canister_call**: The CBOR-encoded call request with `{ content: request }` wrapper
3. **certificate**: The CBOR-encoded read_state request for status checking

## Changes Made

### Previous Implementation
- Used `signUpdateCall` for non-transfer update calls
- Required both call message and read state message to be passed together
- No support for consent messages

### New Implementation
- Uses `signBls` for non-transfer update calls
- Supports ICRC-21 consent message standard
- Sends three components separately:
  1. **consent_request**: ICRC-21 consent message (if available) or minimal data ('00')
  2. **canister_call**: The CBOR-encoded call request
  3. **certificate**: Empty for initial calls ('00'), used for certified responses later

### Code Changes
- **File**: `src/adapters/ic/LedgerAdapter.ts`
- **Method**: `LedgerIdentity.signCbor()`
- **Lines**: 161-200

## Behavior

### Transfer Calls
- Continue to use the regular `sign` method
- No changes to transfer operation flow

### Non-Transfer Update Calls
- Now use `signBls` method
- Improved compatibility with Ledger IC app
- Signature returned in raw RS format (64 bytes)

### Read State Requests
- Continue to use the regular `sign` method
- No changes to read state flow

## Testing

To test the updated Ledger adapter:

1. Connect your Ledger device
2. Open the Internet Computer app on the device
3. Use the following code:

```javascript
import { createPNP } from '@windoge98/plug-n-play';

const pnp = createPNP({
  network: 'ic',
  adapters: {
    ledger: {
      enabled: true,
      transport: 'WebHID'
    }
  }
});

// Connect to Ledger
const account = await pnp.connect('ledger');

// Create an actor for non-transfer calls
const actor = await pnp.getActor(canisterId, idl);

// Call a method (will use signBls internally)
await actor.someMethod();
```

## Compatibility

- **Ledger IC App Version**: Works with latest versions
- **@zondax/ledger-icp**: Uses the signBls method from the library
- **Transport**: Supports both WebHID and WebUSB

## ICRC-21 Consent Message Support

### What is ICRC-21?
ICRC-21 is a standard for consent messages in the Internet Computer ecosystem. It allows canisters to provide human-readable descriptions of what a canister call will do before the user signs it.

### Implementation Status
- **Basic Structure**: ✅ The adapter now includes the structure to support ICRC-21
- **Consent Message Fetching**: 🚧 Placeholder implementation (requires full integration)
- **signBls Integration**: ✅ Properly formats consent messages for the Ledger device

### Future Work
To fully support ICRC-21, the following needs to be implemented:
1. Create an actor for the target canister
2. Call `icrc21_canister_call_consent_message` with the method and arguments
3. Parse the consent message response
4. Display the consent message to the user before signing

## Notes

- The `createReadStateRequest` method is now deprecated but kept for backwards compatibility
- Console logging is included for debugging purposes
- The modal UI properly shows signing status during the operation
- ICRC-21 support is partially implemented with placeholders for future enhancement