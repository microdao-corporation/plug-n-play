# Plug N Play for the Internet Computer

Plug N Play simplifies the integration of Internet Computer wallets into your decentralized applications (dApps). It provides a standardized interface for connecting to various wallets, managing transactions, and interacting with the Internet Computer blockchain.

## Features

- Seamless integration with multiple Internet Computer wallets
- Simplified wallet connection, disconnection, and other functions
- Built-in support for signatures
- Batch transaction support for complex operations
- Robust error handling and delegation refresh mechanisms
- Lightweight and easy to use

## Supported Wallets

- Internet Identity
- Plug
- More to be added

## Installation

Install Plug N Play using npm:

```bash
npm install @windoge98/plug-n-play
```

## Basic Usage

Here's how to initialize and use Plug N Play in your application:

```typescript
import { createPNP, getPNPAdapter } from "@windoge98/plug-n-play";
import { Principal } from "@dfinity/principal";

// Initialize PNP
const pnp = createPNP({
  hostUrl: "https://ic0.app",
  whitelist: ['ryjl3-tyaaa-aaaaa-aaaba-cai'], // ICP Ledger canister
  identityProvider: "https://identity.ic0.app",
});
const ledgerPrincipal = Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai');

// Connect to a wallet
async function connect(walletId: string) {
  const account = await pnp.connect(walletId);
  console.log("Connected to wallet:", account);
  return account;
}

// Get balance
async function getBalance(account: Account) {
  const balance = await pnp.icrc1BalanceOf(ledgerPrincipal, account);
  console.log("Balance:", balance.toString());
  return balance;
}

// Transfer tokens
async function transfer(to: string, amount: bigint) {
  account = {
    owner: Principal.fromText('principal-id'),
    subaccount: []
  }
  const result = await pnp.icrc1_transfer(ledgerPrincipal, amount, account);
  console.log("Transfer result:", result);
  return result;
}
```

## Working with Canisters

Plug N Play allows you to easily interact with canisters. Here's an example:

```typescript
import { idlFactory } from 'path/to/your/canister/did.js';

async function interactWithCanister(canisterId: string) {
  const actor = await pnp.getCanisterActor(canisterId, idlFactory);
  // Now you can call methods on your actor
  const result = await actor.someMethod();
  console.log(result);
}
```

## Best Practices

1. Always initialize PNP before attempting to connect to a wallet.
2. Use try-catch blocks when calling PNP methods to handle potential errors.
3. Keep your canister whitelist up-to-date to ensure smooth interactions.
4. Regularly check for updates to the Plug N Play library to benefit from new features and improvements.
5. For local development, make sure to use the correct `hostUrl` and `identityProvider`.

## License

This project is licensed under the [MIT License](https://github.com/microdao-corporation/plug-n-play/blob/main/LICENSE.txt).

## Support

If you encounter any issues or have questions, please file an issue on our [GitHub issue tracker](https://github.com/microdao-corporation/plug-n-play/issues).

---

For more information about the Internet Computer and Dfinity, visit [https://dfinity.org/](https://dfinity.org/).