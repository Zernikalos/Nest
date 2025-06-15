// vite.preload.config.ts
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        outDir: 'dist/preload',
        lib: {
            entry: resolve(__dirname, 'electronapp/preload.ts'),
            formats: ['cjs'],
            fileName: () => 'preload.js'
        },
        rollupOptions: {
            external: ['electron'],
            output: {
                entryFileNames: '[name].js'
            }
        },
        target: 'node14',
        sourcemap: 'inline',
        commonjsOptions: {
            transformMixedEsModules: true
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'electronapp')
        }
    }
})