# Ledger Hardware Wallet Integration Demo

This demo showcases how to use Ledger hardware wallets with the PNP library for Internet Computer authentication.

## Features

✅ **Hardware Security** - Private keys never leave the Ledger device
✅ **ICRC-21 Support** - Enable consent messages for advanced IC operations
✅ **Browser Detection** - Automatic detection of WebHID API support
✅ **User-Friendly UI** - Clear instructions and error messages for Ledger users

## Requirements

1. **Compatible Browser**: Chrome, Edge, or Opera (WebHID API support required)
2. **Ledger Device**: Nano S/X or Stax
3. **Internet Computer App**: Must be installed and updated on the device
4. **HTTPS or Localhost**: WebHID requires secure context

## How to Use

1. **Connect Your Ledger**
   - Connect your Ledger device via USB
   - Unlock with your PIN
   - Open the Internet Computer app

2. **Click "Ledger" in the Wallet List**
   - The browser will prompt for device permission
   - Select your Ledger device and click "Connect"

3. **Confirm on Device**
   - Some operations require physical confirmation on the Ledger
   - Watch your device screen for prompts

## Configuration

The Ledger adapter is configured in `src/lib/stores/pnp.ts`:

```typescript
ledger: {
  enabled: true,
  derivePath: "m/44'/223'/0'/0/0",  // Standard ICP derivation path
  enableICRC21: true                  // Enable ICRC-21 consent messages
}
```

## UI Features

### Browser Compatibility Check
- The demo automatically detects if the browser supports WebHID
- Incompatible browsers show "Chrome/Edge only" message
- The Ledger button is disabled on unsupported browsers

### Visual Indicators
- **Hardware Badge**: Orange "Hardware" badge shows it's a hardware wallet
- **Connection Instructions**: Helpful message when connecting
- **Error Messages**: Clear, actionable error messages for common issues

### Connected State
When connected via Ledger, users see:
- A special note about transaction confirmations
- The principal ID derived from the hardware wallet
- ICP balance (if available)

## Common Issues

| Error | Solution |
|-------|----------|
| "WebHID API not supported" | Use Chrome, Edge, or Opera browser |
| "No device selected" | User cancelled the device selection |
| "App not open" | Open the Internet Computer app on Ledger |
| "Transaction rejected" | User declined on the device |

## Security Notes

- All transactions require physical confirmation on the device
- The private key never leaves the Ledger
- Each operation shows details on the Ledger screen
- Users can verify addresses on the device screen

## Testing

1. Start the demo: `npm run dev`
2. Navigate to http://localhost:3001
3. Connect your Ledger and try the connection flow
4. Test transactions to see the confirmation flow

## Advanced Features

### Address Verification
Users can verify their address on the device screen:
```typescript
const ledgerAdapter = pnp.getAdapter('ledger') as LedgerAdapter;
await ledgerAdapter.showAddressOnDevice();
```

### Direct Transaction Signing
For special transaction types (e.g., staking):
```typescript
const ledgerAdapter = pnp.getAdapter('ledger') as LedgerAdapter;
const signature = await ledgerAdapter.signTransaction(
  Buffer.from(message),
  0x01  // Transaction type: 0x00 for default, 0x01 for stake
);
```

### Transport Configuration
The adapter supports both WebHID (default) and WebUSB:
```typescript
ledger: {
  enabled: true,
  transport: 'WebHID',  // or 'WebUSB'
  derivePath: "m/44'/223'/0'/0/0"
}
```