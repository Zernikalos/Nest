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
    define: {
        // Pass DEBUG environment variable to the browser
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG || ''),
    },
    build: {
        outDir: path.join(__dirname, 'dist'),
        rollupOptions: {
            output: {
                chunkFileNames: 'assets/js/[name].js',
                entryFileNames: 'assets/js/[name].js',
                assetFileNames: 'assets/[ext]/[name].[ext]',

                manualChunks: {
                    // Separar Monaco Editor en su propio chunk
                    'monaco-editor': ['@monaco-editor/react'],
                    // Separar Zernikalos en su propio chunk
                    'zernikalos': ['@zernikalos/zernikalos'],
                    'zkbuilder': ['@zernikalos/zkbuilder'],
                    // Separar Radix UI en su propio chunk
                    'radix-ui': [
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-label',
                        '@radix-ui/react-scroll-area',
                        '@radix-ui/react-select',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-switch',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-toggle',
                        '@radix-ui/react-toggle-group',
                        '@radix-ui/react-tooltip'
                    ],
                    'utils': ['clsx', 'class-variance-authority', 'tailwind-merge']
                }
            }
        },
        optimizeDeps: {
            include: ['react', 'react-dom'],
            exclude: ['@monaco-editor/react', '@zernikalos/zernikalos']
        }
    },
});

export default reactUiConfig;