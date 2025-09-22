# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Plug N Play (PNP) is a unified wallet adapter library for Internet Computer dApps supporting IC, Solana (SIWS), and Ethereum (SIWE) wallets. The project has evolved into a modular architecture with separate packages for different blockchain ecosystems.

## Project Structure

```text
w98-pnp/
   src/                      # Core IC wallet functionality
      index.ts              # Main entry point, PNP class
      config.ts             # Configuration management  
      adapters/             # IC wallet adapter implementations
         BaseAdapter.ts     # Abstract base classes
         BaseDelegationAdapter.ts
         BaseSignerAdapter.ts
         ic/                # IC-specific adapters
            IIAdapter.ts    # Internet Identity
            PlugAdapter.ts  # Plug wallet
            UnifiedSignerAdapter.ts # Signer-based wallets
      managers/             # Core functionality managers
         ActorManager.ts    # IC actor creation/caching
         ConfigManager.ts   # Configuration merging
         ConnectionManager.ts # Wallet connections
         StateManager.ts    # State machine
         ErrorManager.ts    # Error handling & logging
         StatePersistenceManager.ts # State persistence
      types/                # TypeScript definitions
         AdapterTypes.ts    # Adapter interfaces
         AdapterConfigs.ts  # Adapter configurations
         AdapterExtensions.ts # Extension system types
         SiwsAdapterInterface.ts # SIWS interface
         WalletTypes.ts     # Wallet-related types
      utils.ts              # Utility functions
      did/                  # Interface definitions
   packages/                # Modular blockchain-specific packages
      solana/              # Solana wallet adapters (SIWS)
         src/
            index.ts        # Solana extension & adapters
            SiwsAdapter.ts  # Base SIWS adapter
            SimpleSiwsAdapter.ts # Simplified implementation
            SplTokenManager.ts # SPL token operations
            extensions.ts   # Solana extension definition
      ethereum/            # Ethereum wallet adapters (SIWE) 
         src/
            index.ts        # Ethereum extension & adapters
            SiweAdapter.ts  # SIWE adapter implementation
            extensions.ts   # Ethereum extension definition
   demo/                    # Demo applications
   tests/                   # Test files
   dist/                    # Build output for main package
```

## Key Commands

### Build Commands

```bash
# Core package (IC wallets)
npm run build              # Production build with minification

# Modular packages 
npm run build:solana       # Build Solana package only
npm run build:ethereum     # Build Ethereum package only
npm run build:all          # Build all packages (main + solana + ethereum)

# Individual package builds (from package directories)
cd packages/solana && npm run build
cd packages/ethereum && npm run build
```

- Uses Vite with dynamic package selection via `BUILD_PACKAGE` environment variable
- Outputs ES module and CommonJS formats for packages
- Main package: `dist/plug-n-play.es.js` (ES module only)
- Package outputs: `packages/{solana,ethereum}/dist/`
- TypeScript declarations generated for all packages
- Assets inlined for package bundles

### Testing

```bash
npm test                   # Run tests in watch mode
npm run test:ui            # Run tests with Vitest UI
npm run coverage           # Generate test coverage report

# Package-specific testing
cd packages/solana && npm run typecheck
```

- Uses Vitest with jsdom environment
- Test files: `tests/*.test.ts`
- Coverage reports in `coverage/`
- TypeScript checking available per package

### Development

```bash
npm run dev                # Start Vite dev server (main package)
npm run preview            # Preview production build

# Package development
cd packages/solana && npm run dev

# Workspace linking for local development
npm run link:all           # Link all packages for local development  
npm run unlink:all         # Unlink packages
```

## Architecture Overview

### Modular Package System

The project uses a **monorepo with workspace packages** approach:

1. **Main Package** (`@windoge98/plug-n-play`)
   - Core IC wallet functionality (Internet Identity, Plug, NFID)
   - Base adapter classes and manager pattern
   - Configuration system with extension support

2. **Solana Package** (`@windoge98/pnp-solana`) 
   - Solana wallet adapters via Sign-In with Solana (SIWS)
   - Phantom, Solflare, WalletConnect support
   - SPL token operations and Buffer polyfills

3. **Ethereum Package** (`@windoge98/pnp-ethereum`)
   - Ethereum wallet adapters via Sign-In with Ethereum (SIWE)
   - MetaMask, WalletConnect support
   - ethers.js and viem integration

### Extension System

**Declarative Adapter Registration**: Packages export extensions that register adapters automatically.

```typescript
// Instead of manual loops
import { SolanaExtension } from '@windoge98/pnp-solana';

const pnp = createPNP({
  extensions: [SolanaExtension],  // Auto-registers Solana adapters
  adapters: {
    phantomSiws: { enabled: true }
  }
});
```

### Core Components

1. **PNP Class** (`src/index.ts`)
   - Main entry point with `createPNP()` factory
   - Extension system for modular wallet support
   - Methods: `connect()`, `disconnect()`, `getActor()`, `isAuthenticated()`

2. **Managers** (`src/managers/`)
   - **ConnectionManager**: Adapter lifecycle and wallet connections
   - **ActorManager**: IC actor creation with optimized caching
   - **ConfigManager**: Configuration merging with extension support
   - **StateManager**: State transitions (INITIALIZED → CONNECTING → CONNECTED)
   - **ErrorManager**: Centralized logging with configurable levels

3. **Configuration System** (`src/config.ts`)
   - `createPNPConfig()`: Factory with environment detection
   - Extension registration and adapter configuration
   - Object-based configuration with type safety

4. **Adapter Base Classes** (`src/adapters/`)
   - **BaseAdapter**: Common functionality
   - **BaseDelegationAdapter**: IC delegation-based wallets
   - **BaseSignerAdapter**: IC signer-based wallets (Slide Computer)

### Build System Architecture

**Multi-Package Vite Configuration**:
- Dynamic entry points based on `BUILD_PACKAGE` environment variable
- Package-specific externals and polyfills
- Buffer/process polyfills for Solana package (browser compatibility)
- Asset inlining for wallet logos in packages

## Type System & Configuration

### Modern Configuration API

```typescript
// Object-based configuration with extensions
const pnp = createPNP({
  network: 'ic',                    // 'local' | 'ic'
  extensions: [SolanaExtension],    // Modular wallet support
  providers: {
    siws: 'SIWS_CANISTER_ID',      // Solana integration
    siwe: 'SIWE_CANISTER_ID'       // Ethereum integration
  },
  adapters: {
    ii: { enabled: true },
    phantomSiws: { enabled: true }
  }
});

// Minimal configuration example
const pnp2 = createPNP({
  network: 'local',
  extensions: [SolanaExtension],
  adapters: {
    ii: { enabled: true }
  }
});
```

### Key Types

```typescript
// Extension system
AdapterExtension {
  [adapterId: string]: AdapterRegistration;
}

// Configuration with extensions
GlobalPnpConfig {
  network?: 'local' | 'ic';
  extensions?: AdapterExtension[];
  providers?: { siws?: string; siwe?: string; };
  adapters?: Record<string, AdapterConfig>;
}

// State management  
PnpState: INITIALIZED | CONNECTING | CONNECTED | DISCONNECTING | DISCONNECTED | ERROR
```

## Development Guidelines

### Modular Development

- **Core**: Focus on IC wallets and base functionality
- **Packages**: Blockchain-specific implementations with minimal core dependencies
- **Extensions**: Use extension system for clean adapter registration
- **Testing**: Test packages independently with their specific dependencies

### Build Process

- **Development**: Use `npm run dev` for hot reloading
- **Production**: Always run `npm run build:all` to ensure all packages work
- **Linking**: Use workspace scripts for local package development
- **CI/CD**: Build system supports separate package deployments

### Error Handling & Debugging

- Use ErrorManager for consistent logging across packages
- Enable DEBUG log level for verbose output
- Check browser console for wallet-specific errors
- State inspection via `pnp.getState()` for debugging flows

## Package Development

### Adding Solana Wallets

1. Extend existing SIWS adapters in `packages/solana/src/`
2. Register in `SolanaExtension` definition
3. Add wallet-specific configuration options
4. Test with SIWS provider canister

### Adding Ethereum Wallets  

1. Implement SIWE adapter in `packages/ethereum/src/`
2. Register in `EthereumExtension` definition
3. Handle ethers.js/viem integration patterns
4. Test with SIWE provider canister

### Cross-Package Dependencies

- Packages depend on main package for base classes
- Avoid circular dependencies between packages
- Use peer dependencies for shared IC packages
- Bundle blockchain-specific dependencies in packages

## Performance Considerations

- **Lazy Loading**: Packages only loaded when extensions are used
- **Tree Shaking**: ES modules with proper sideEffects configuration
- **Actor Caching**: Optimized cache keys by wallet+canister+options
- **Bundle Optimization**: Separate packages prevent monolithic bundles
- **Polyfill Strategy**: Selective polyfills per package (Buffer for Solana only)

## Safari Compatibility

Safari requires special handling for popup-based wallets:

```javascript
// Correct: Prepare adapter before user action completes
button.onclick = async () => {
  await pnp.openChannel(); // Initialize AuthClient early
  await pnp.connect('ii'); // Popup opens without blocking
};
```

The `openChannel()` method minimizes async operations before popup creation, preventing Safari's popup blocker.