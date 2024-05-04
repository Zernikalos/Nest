// vite.config.js
import { defineConfig, mergeConfig } from 'vite'
import {nestUiConfig} from '../nestui/vite.config'
import path from "path";

export default defineConfig((env) => {
    return mergeConfig(nestUiConfig, {
        build: {
            outDir: path.join(__dirname, 'dist', 'renderer'),
        }
    })
})