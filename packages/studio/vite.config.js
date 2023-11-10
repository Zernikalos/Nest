import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const languageWorkers = ['editorWorkerService', 'json', 'typescript']

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    plugins: [vue()],
    build: {
        outDir: path.join(__dirname, '..', 'electronapp', 'dist', 'renderer'),
        // outDir: path.join(__dirname, 'dist'),
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        }
    },
    resolve: {
        alias: {
            '@studio': path.resolve(__dirname, 'src'),
        }
    }
})
