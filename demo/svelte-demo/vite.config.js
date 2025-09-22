import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import inject from '@rollup/plugin-inject'

const bufferPolyfillPath = path.resolve(
  __dirname,
  'node_modules/vite-plugin-node-polyfills/shims/buffer/dist/index.js'
);

const processPolyfillPath = path.resolve(
  __dirname,
  'node_modules/process/browser.js'
);

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        dev: true,
        hmr: true
      }
    }),
    // Inject Buffer polyfill for browser
    inject({
      Buffer: ['buffer', 'Buffer'],
      process: 'process',
    }),
  ],
  resolve: {
    alias: {
      '@pnp': path.resolve(__dirname, '../../src'),
      // Make sure buffer polyfill is available
      buffer: bufferPolyfillPath,
      process: processPolyfillPath,
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    },
    include: [
      'buffer', 
      'process',
      '@solana/web3.js',
      '@solana/spl-token',
      '@solana/spl-token-metadata',
      '@solana/wallet-adapter-base',
      '@solana/wallet-adapter-phantom',
      '@solana/wallet-adapter-solflare'
    ]
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: []
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
