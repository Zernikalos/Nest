import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
import { fromRoot, createAppAliases } from '../config/studio-paths.mjs';

const require = createRequire(import.meta.url);

const OPTIONAL_LAZY_IMPORTS = [
    '@nestjs/microservices',
    '@nestjs/platform-socket.io',
    '@nestjs/websockets/socket-module',
    '@nestjs/microservices/microservices-module',
    'bufferutil',
    'utf-8-validate',
];

const emptyShim = fromRoot('electronapp', 'src', 'shims', 'empty.cjs');

/** Nest ValidationPipe expects CJS exports (plainToInstance, validate, etc.). */
const NEST_VALIDATION_CJS_ALIASES = [
    { find: 'class-transformer', replacement: fromRoot('node_modules/class-transformer/cjs/index.js') },
    { find: 'class-validator', replacement: fromRoot('node_modules/class-validator/cjs/index.js') },
];

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createOptionalDependencyAliases() {
    return OPTIONAL_LAZY_IMPORTS.filter((resource) => {
        try {
            require.resolve(resource);
            return false;
        } catch {
            return true;
        }
    }).map((resource) => ({
        find: new RegExp(`^${escapeRegExp(resource)}$`),
        replacement: emptyShim,
    }));
}

export default defineConfig({
    build: {
        ssr: true,
        outDir: fromRoot('electronapp', 'dist', 'main'),
        emptyOutDir: true,
        lib: {
            entry: fromRoot('electronapp', 'src', 'main.ts'),
            formats: ['cjs'],
            fileName: () => 'index.js',
        },
        rollupOptions: {
            external: ['electron'],
            output: {
                entryFileNames: 'index.js',
            },
        },
        target: 'node24',
        sourcemap: 'inline',
        minify: false,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    ssr: {
        noExternal: true,
    },
    resolve: {
        alias: [
            ...createAppAliases(fromRoot('electronapp', 'src')),
            { find: '@zstudio-server', replacement: fromRoot('nestserver', 'dist', 'main.js') },
            ...NEST_VALIDATION_CJS_ALIASES,
            ...createOptionalDependencyAliases(),
        ],
    },
});
