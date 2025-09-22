# Ledger Adapter Changes Summary

## What Changed
The Ledger adapter has been updated to use the `signBls` method from the `@zondax/ledger-icp` library instead of `signUpdateCall` for non-transfer update calls.

## Why This Change Was Needed
- The user reported that `signBls` is required for ICRC-21 consent message support
- Better compatibility with the latest Ledger IC app
- Foundation for supporting human-readable transaction descriptions on Ledger devices

## Technical Implementation

### Method Used: `signBls`
The `signBls` method takes three hex-encoded parameters:
1. **consent_request**: ICRC-21 consent message (or '00' if not available)
2. **canister_call**: The CBOR-encoded canister call request
3. **certificate**: Certificate data (or '00' for initial calls)

### Call Flow
```
Non-Transfer Update Call
    ↓
Check if ICRC-21 consent available
    ↓
Encode call as CBOR
    ↓
Call signBls with three parameters
    ↓
Return 64-byte raw signature
```

### Files Modified
- `src/adapters/ic/LedgerAdapter.ts` - Main implementation changes
- `LEDGER_SIGNBLS_UPDATE.md` - Documentation of changes

## Current Status
✅ **Implemented**
- signBls method integration for non-transfer calls
- Proper parameter formatting
- Error handling and modal UI updates

🚧 **Partial Implementation**
- ICRC-21 consent message fetching (placeholder ready for future implementation)

## Testing Recommendations
1. Test with a Ledger device and the Internet Computer app
2. Verify non-transfer update calls work correctly
3. Confirm transfers still use the regular sign method
4. Check that the modal displays appropriate messages

## Next Steps for Full ICRC-21 Support
1. Implement actual ICRC-21 consent message fetching from canisters
2. Create actors to call `icrc21_canister_call_consent_message`
3. Parse and display consent messages to users
4. Pass actual consent data to the Ledger device via signBls

## Backwards Compatibility
- Transfer operations remain unchanged (still use regular `sign` method)
- Read state requests continue to work as before
- The adapter maintains full compatibility with existing code