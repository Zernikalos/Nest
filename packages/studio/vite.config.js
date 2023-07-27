import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monacoEditorPlugin from "vite-plugin-monaco-editor"

const languageWorkers = ['editorWorkerService', 'json', 'typescript']

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    plugins: [monacoEditorPlugin({languageWorkers}), vue()],
    build: {
        outDir: path.join(__dirname, 'dist')
    },
    resolve: {
        alias: {
            '@studio': path.resolve(__dirname, 'src'),
        }
    }
})
