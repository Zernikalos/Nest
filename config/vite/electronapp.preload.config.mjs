import { defineConfig } from 'vite';
import { fromRoot, createAppAliases } from '../studio-paths.mjs';

export default defineConfig({
    build: {
        outDir: fromRoot('electronapp', 'dist', 'preload'),
        lib: {
            entry: fromRoot('electronapp', 'src', 'preload.ts'),
            formats: ['cjs'],
            fileName: () => 'preload.js',
        },
        rollupOptions: {
            external: ['electron'],
            output: {
                entryFileNames: '[name].js',
            },
        },
        target: 'node14',
        sourcemap: 'inline',
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    resolve: {
        alias: createAppAliases(fromRoot('electronapp', 'src')),
    },
});
