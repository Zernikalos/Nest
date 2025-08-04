import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export const reactUiConfig = defineConfig({
    root: __dirname,
    plugins: [
        react(),
        tailwindcss({
            config: {
                content: [
                    './index.html',
                    './src/**/*.{vue,js,ts,jsx,tsx}'
                ]
            }
        })
    ],
    build: {
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
            '@': path.resolve(__dirname, 'src'),
        },
    },
});

export default reactUiConfig;