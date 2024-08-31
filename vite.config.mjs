import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    logLevel: 'debug',
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'PlugNPlay',
      formats: ['es', 'umd'],
      fileName: (format) => `plug-n-play.${format}.js`,
    },
    rollupOptions: {
      external: [
        '@astrox/sdk-web',
        '@astrox/sdk-webview',
        '@dfinity/auth-client',
        '@dfinity/principal',
        '@dfinity/candid',
        '@dfinity/agent',
        '@dfinity/identity',
        '@fort-major/msq-client',
        '@fort-major/msq-shared',
      ],
      output: {
        globals: {
          '@astrox/sdk-web': 'astrox.sdkWeb',
          '@astrox/sdk-webview': 'astrox.sdkWebview',
          '@dfinity/auth-client': 'dfinity.authClient',
          '@dfinity/principal': 'dfinity.principal',
          '@dfinity/candid': 'dfinity.candid',
          '@dfinity/agent': 'dfinity.agent',
          '@dfinity/identity': 'dfinity.identity',
          '@fort-major/msq-client': 'fortMajor.msqClient',
          '@fort-major/msq-shared': 'fortMajor.msqShared',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@src': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      compilerOptions: {
        declaration: true,
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'assets/*',
          dest: 'assets',
        },
      ],
    }),
  ],
});
