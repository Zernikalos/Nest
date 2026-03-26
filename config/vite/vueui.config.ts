import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import * as path from 'path';
import * as fs from 'fs';
import { fromRoot, createAppAliases } from '../studio-paths.mjs';

const VITE_DEV_PORT_FILE = '.vite-dev-port';

/** Writes the dev server port to a file so Electron can load the UI when the port is dynamic. */
function vitePluginWriteDevPort() {
  return {
    name: 'write-dev-port',
    configureServer(server: { httpServer?: { once: (ev: string, fn: () => void) => void; address: () => unknown } }) {
      server.httpServer?.once('listening', () => {
        const address = server.httpServer?.address();
        const port =
          address && typeof address === 'object' && address !== null && 'port' in address
            ? (address as { port: number }).port
            : null;
        if (port) {
          fs.writeFileSync(path.join(process.cwd(), VITE_DEV_PORT_FILE), String(port), 'utf8');
        }
      });
    },
  };
}

export default defineConfig({
  root: fromRoot('vueui'),
  plugins: [vue(), tailwindcss(), vitePluginWriteDevPort()],
  base: './',
  resolve: {
    alias: createAppAliases(fromRoot('vueui', 'src')),
    preserveSymlinks: true,
  },
  server: {
    port: 0,
  },
  build: {
    outDir: fromRoot('vueui', 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          zernikalos: ['@zernikalos/zernikalos'],
          zkbuilder: ['@zernikalos/zkbuilder'],
        },
      },
    },
    optimizeDeps: {
      exclude: ['@zernikalos/zernikalos', '@zernikalos/zkbuilder'],
    },
  },
});
