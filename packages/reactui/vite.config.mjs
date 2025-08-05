import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export const reactUiConfig = defineConfig({
    root: __dirname,
    plugins: [
        react(),
        tailwindcss()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});

export default reactUiConfig;