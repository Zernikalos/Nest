import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Use ide-core source in dev so Immer/state fixes apply without relying on stale dist
      '@zstudio/ide-core': fileURLToPath(new URL('../ide-core/src/index.ts', import.meta.url)),
    },
    preserveSymlinks: true,
  },
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          'zernikalos': ['@zernikalos/zernikalos'],
          'zkbuilder': ['@zernikalos/zkbuilder'],
        },
      },
    },
    optimizeDeps: {
      exclude: ['@zernikalos/zernikalos', '@zernikalos/zkbuilder'],
    },
  },
});
