// vite.config.js
import { defineConfig, mergeConfig } from 'vite'
import {nestUiConfig} from './packages/nestui/vite.config.mjs'
import path from "path";

export default defineConfig((env) => {
    return mergeConfig(nestUiConfig, {
        base: './',
        build: {
            outDir: path.join(__dirname, 'dist', 'renderer'),
        }
    })
})