// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    // base: './aux/dist',
    // build: {
    //     rollupOptions: {
    //         input: {main_window: resolve(__dirname, '../nestui/dist/index.html')}
    //     },
    // },
    root: './aux/dist'
})