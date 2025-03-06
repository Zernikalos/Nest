// vite.preload.config.ts
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        outDir: 'dist/preload',
        lib: {
            entry: resolve(__dirname, 'src/preload.ts'),
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
        // Asegurarse que estos módulos se manejen correctamente
        commonjsOptions: {
            transformMixedEsModules: true
        }
    },
    resolve: {
        // Asegúrate de que Vite pueda resolver las importaciones
        alias: {
            '@': resolve(__dirname, 'src')
        }
    }
})