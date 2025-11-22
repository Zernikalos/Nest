// vite.config.js
import { defineConfig, mergeConfig } from 'vite'
import {reactUiConfig} from './packages/reactui/vite.config.mjs'
import path from "path";

export default defineConfig((env) => {
    return mergeConfig(reactUiConfig, {
        //root: path.join(__dirname, 'packages', 'reactui'),
        build: {
            outDir: path.join(__dirname, 'dist', 'renderer'),
        }
    })
})