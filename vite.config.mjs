import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import viteCompression from "vite-plugin-compression";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import inject from "@rollup/plugin-inject";

// Determine build environment and package
const isProd = process.env.NODE_ENV === "production";
const buildPackage = process.env.BUILD_PACKAGE || "main"; // 'main', 'metamask', 'okx', 'phantom', 'coinbase', 'rabby', etc.
const needsNodePolyfills = ['metamask', 'okx', 'phantom', 'solflare', 'walletconnect', 'coinbase', 'rabby'].includes(buildPackage);

// Package-specific configurations
const packageConfigs = {
  main: {
    entry: resolve(__dirname, "src/index.ts"),
    name: "PlugNPlay",
    fileName: (format) => `plug-n-play.${format}.js`,
    outDir: "dist",
    external: [
      // Keep large optional dependencies external
      "@walletconnect/ethereum-provider",
      "ethers",
      "ic-siwe-js",
      "viem",
      // Bundle everything else to avoid ESM/CJS issues
      // This includes @dfinity/* and @slide-computer/* packages
    ],
    formats: ["es"],
    dtsOptions: {
      insertTypesEntry: true,
      compilerOptions: {
        declaration: true,
        skipLibCheck: true,
      },
      logDiagnostics: isProd,
      skipDiagnostics: !isProd,
    },
    copyAssets: true,
  },
  metamask: {
    entry: resolve(__dirname, "packages/metamask/src/index.ts"),
    name: "PNPMetaMask",
    fileName: (format) => format === 'es' ? 'index.es.js' : 'index.js',
    outDir: "packages/metamask/dist",
    external: [
      "@dfinity/agent",
      "@dfinity/identity",
      "@dfinity/principal",
      "ic-siwe-js",
      "viem",
      "viem/chains",
      "@windoge98/plug-n-play",
      /^@windoge98\//,
    ],
    formats: ["es", "cjs"],
    dtsOptions: {
      insertTypesEntry: true,
      rollupTypes: false,
      root: "packages/metamask",
      outDir: "dist",
      include: ["src/**/*"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
      tsConfigFilePath: "./tsconfig.json",
    },
    copyAssets: false,
    assetsInlineLimit: 100000, // Inline MetaMask logo
  },
  okx: {
    entry: resolve(__dirname, "packages/okx/src/index.ts"),
    name: "PNPOkx",
    fileName: (format) => format === 'es' ? 'index.es.js' : 'index.js',
    outDir: "packages/okx/dist",
    external: [
      "@dfinity/agent",
      "@dfinity/identity",
      "@dfinity/principal",
      "@solana/web3.js",
      "@solana/wallet-adapter-base",
      "bs58",
      // Buffer bundled - not external
      /^@windoge98\//,
    ],
    formats: ["es", "cjs"],
    dtsOptions: {
      insertTypesEntry: true,
      rollupTypes: false,
      root: "packages/okx",
      outDir: "dist",
      include: ["src/**/*"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
      tsConfigFilePath: "./tsconfig.json",
    },
    copyAssets: false,
    assetsInlineLimit: 100000, // Inline OKX logo
  },
  phantom: {
    entry: resolve(__dirname, "packages/phantom/src/index.ts"),
    name: "PNPPhantom",
    fileName: (format) => format === 'es' ? 'index.es.js' : 'index.js',
    outDir: "packages/phantom/dist",
    external: [
      "@dfinity/agent",
      "@dfinity/identity",
      "@dfinity/principal",
      "@solana/web3.js",
      "@solana/wallet-adapter-base",
      "@solana/wallet-adapter-phantom",
      "bs58",
      // Remove buffer from externals - bundle it instead
      /^@windoge98\//,
    ],
    formats: ["es", "cjs"],
    dtsOptions: {
      insertTypesEntry: true,
      rollupTypes: false,
      root: "packages/phantom",
      outDir: "dist",
      include: ["src/**/*"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
      tsConfigFilePath: "./tsconfig.json",
    },
    copyAssets: false,
    assetsInlineLimit: 100000, // Inline Phantom logo
  },
  solflare: {
    entry: resolve(__dirname, "packages/solflare/src/index.ts"),
    name: "PNPSolflare",
    fileName: (format) => format === 'es' ? 'index.es.js' : 'index.js',
    outDir: "packages/solflare/dist",
    external: [
      "@dfinity/agent",
      "@dfinity/identity",
      "@dfinity/principal",
      "@solana/web3.js",
      "@solana/wallet-adapter-base",
      "@solana/wallet-adapter-solflare",
      "bs58",
      // Remove buffer from externals - bundle it instead
      /^@windoge98\//,
    ],
    formats: ["es", "cjs"],
    dtsOptions: {
      insertTypesEntry: true,
      rollupTypes: false,
      root: "packages/solflare",
      outDir: "dist",
      include: ["src/**/*"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
      tsConfigFilePath: "./tsconfig.json",
    },
    copyAssets: false,
    assetsInlineLimit: 100000, // Inline Solflare logo
  },
  walletconnect: {
    entry: resolve(__dirname, "packages/walletconnect/src/index.ts"),
    name: "PNPWalletConnect",
    fileName: (format) => format === 'es' ? 'index.es.js' : 'index.js',
    outDir: "packages/walletconnect/dist",
    external: [
      "@dfinity/agent",
      "@dfinity/identity",
      "@dfinity/principal",
      "@solana/web3.js",
      "@solana/wallet-adapter-base",
      "@solana/wallet-adapter-walletconnect",
      "bs58",
      // Remove buffer from externals - bundle it instead
      /^@windoge98\//,
    ],
    formats: ["es", "cjs"],
    dtsOptions: {
      insertTypesEntry: true,
      rollupTypes: false,
      root: "packages/walletconnect",
      outDir: "dist",
      include: ["src/**/*"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
      tsConfigFilePath: "./tsconfig.json",
    },
    copyAssets: false,
    assetsInlineLimit: 100000, // Inline WalletConnect logo
  },
  coinbase: {
    entry: resolve(__dirname, "packages/coinbase/src/index.ts"),
    name: "PNPCoinbase",
    fileName: (format) => format === 'es' ? 'index.es.js' : 'index.js',
    outDir: "packages/coinbase/dist",
    external: [
      "@dfinity/agent",
      "@dfinity/identity",
      "@dfinity/principal",
      "@solana/web3.js",
      "@solana/wallet-adapter-base",
      "@solana/wallet-adapter-coinbase",
      "bs58",
      // Remove buffer from externals - bundle it instead
      /^@windoge98\//,
    ],
    formats: ["es", "cjs"],
    dtsOptions: {
      insertTypesEntry: true,
      rollupTypes: false,
      root: "packages/coinbase",
      outDir: "dist",
      include: ["src/**/*"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
      tsConfigFilePath: "./tsconfig.json",
    },
    copyAssets: false,
    assetsInlineLimit: 100000, // Inline Coinbase logo
  },
  rabby: {
    entry: resolve(__dirname, "packages/rabby/src/index.ts"),
    name: "PNPRabby",
    fileName: (format) => format === 'es' ? 'index.es.js' : 'index.js',
    outDir: "packages/rabby/dist",
    external: [
      "@dfinity/agent",
      "@dfinity/identity",
      "@dfinity/principal",
      "ic-siwe-js",
      "viem",
      "viem/chains",
      "@windoge98/plug-n-play",
      /^@windoge98\//,
    ],
    formats: ["es", "cjs"],
    dtsOptions: {
      insertTypesEntry: true,
      rollupTypes: false,
      root: "packages/rabby",
      outDir: "dist",
      include: ["src/**/*"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
      tsConfigFilePath: "./tsconfig.json",
    },
    copyAssets: false,
    assetsInlineLimit: 100000, // Inline Rabby logo
  },
};

const currentConfig = packageConfigs[buildPackage];

export default defineConfig({
  // Include assets for MetaMask, OKX, Phantom, and Coinbase packages
  ...((buildPackage === 'metamask' || buildPackage === 'okx' || buildPackage === 'phantom' || buildPackage === 'coinbase') && {
    assetsInclude: ['**/*.webp', '**/*.svg', '**/*.png', '**/*.jpg'],
  }),
  
  build: {
    minify: isProd ? 'terser' : false,
    lib: {
      entry: currentConfig.entry,
      name: currentConfig.name,
      formats: currentConfig.formats,
      fileName: currentConfig.fileName,
    },
    rollupOptions: {
      external: currentConfig.external,
      onwarn(warning, warn) {
        // Suppress "this" keyword warnings from @slide-computer libraries
        if (warning.code === 'THIS_IS_UNDEFINED') {
          return;
        }
        // Suppress circular dependency warnings from known libraries
        if (warning.code === 'CIRCULAR_DEPENDENCY' && (
          warning.message.includes('@slide-computer') ||
          warning.message.includes('viem') ||
          warning.message.includes('ox')
        )) {
          return;
        }
        // Suppress unused export warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
          return;
        }
        warn(warning);
      },
      output: {
        format: currentConfig.formats[0],
        exports: "named",
        globals: {
          ...(needsNodePolyfills && {
            // Provide globals for polyfills only when needed
            'buffer': 'buffer',
            'process': 'process',
          }),
        },
        ...(currentConfig.manualChunks && {
          manualChunks: currentConfig.manualChunks,
        }),
      },
      plugins: [
        ...(needsNodePolyfills ? [
          inject({
            Buffer: ["buffer", "Buffer"],
            process: ["process", "process"],
          })
        ] : []),
      ],
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
      esmExternals: ['@dfinity/identity'],
      requireReturnsDefault: 'auto',
    },
    outDir: currentConfig.outDir,
    emptyOutDir: true,
    reportCompressedSize: isProd,
    chunkSizeWarningLimit: 1000,
    target: "es2020",
    ...(currentConfig.assetsInlineLimit && {
      assetsInlineLimit: currentConfig.assetsInlineLimit,
    }),
  },
  
  test: {
    globals: true,
    environment: "jsdom",
  },
  
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    global: "globalThis",
    // Polyfill 'self' for SSR compatibility
    self: "globalThis",
  },
  
  resolve: {
    alias: {
      "@": resolve(__dirname, buildPackage === 'main' ? "./src" : `./packages/${buildPackage}/src`),
      "@types": resolve(__dirname, buildPackage === 'main' ? "src/types" : `packages/${buildPackage}/src/types`),
      "@src": resolve(__dirname, buildPackage === 'main' ? "src" : `packages/${buildPackage}/src`),
      ...(needsNodePolyfills ? {
        buffer: "buffer/",
        process: "process/browser",
        stream: "stream-browserify",
        util: "util/",
      } : {}),
      // Fix for @dfinity/identity ESM imports - add .js extensions
      "@dfinity/identity/lib/cjs/identity/partial": "@dfinity/identity/lib/cjs/identity/partial.js",
      "@dfinity/identity/lib/esm/identity/partial": "@dfinity/identity/lib/esm/identity/partial.js",
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
      format: "esm",
      mainFields: ["module", "main"],
      conditions: ["module", "import", "default"],
      define: {
        global: "globalThis",
      },
      plugins: [
        ...(needsNodePolyfills ? [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
          }),
          NodeModulesPolyfillPlugin(),
        ] : []),
      ],
    },
    include: [
      // Pre-bundle problematic dependencies
      "@dfinity/agent",
      "@dfinity/identity", 
      "@dfinity/candid",
      "@dfinity/principal",
      "@dfinity/auth-client",
      "@dfinity/utils",
      "borc",
      "bignumber.js",
      ...(needsNodePolyfills ? [
        "buffer",
        "process/browser",
      ] : []),
    ],
  },
  
  plugins: [
    // TypeScript declarations plugin
    dts(currentConfig.dtsOptions),
    
    // Static asset copying (only for main package)
    ...(currentConfig.copyAssets ? [
      viteStaticCopy({
        targets: [
          {
            src: "assets/*",
            dest: "assets",
          },
        ],
      }),
    ] : []),
    
    // Compression plugins for production
    ...(isProd ? [
      viteCompression({
        verbose: false,
        disable: false,
        threshold: 5024 * 10,
        algorithm: "gzip",
        ext: ".gz",
      }),
      viteCompression({
        verbose: false,
        disable: false,
        threshold: 5024 * 10,
        algorithm: "brotliCompress",
        ext: ".br",
      }),
    ] : []),
  ],
  
  // Dev server configuration
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
    },
  },
});