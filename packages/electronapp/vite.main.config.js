import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
        browserField: false,
        mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
    build: {
        outDir: 'dist',
        minify: false,
        target: 'esnext'
    }
});