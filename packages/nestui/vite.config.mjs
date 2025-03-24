import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const languageWorkers = ['editorWorkerService', 'json', 'typescript']

// https://vitejs.dev/config/
export const nestUiConfig = defineConfig({
    root: __dirname,
    plugins: [vue(), tailwindcss()],
    build: {
        //outDir: path.join(__dirname, '..', 'electronapp', 'dist', 'renderer'),
        outDir: path.join(__dirname, 'dist'),
        rollupOptions: {
            output: {
                entryFileNames: "assets/[name].js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: "assets/[name].[ext]"
            }
        }
    },
    resolve: {
        alias: {
            '@nestui': path.resolve(__dirname, 'src'),
        }
    }
})

export default nestUiConfig
