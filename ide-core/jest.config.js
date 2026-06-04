import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('jest').Config} */
export default {
    rootDir: configDir,
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: [
        'src/common/**/*.ts',
        '!src/common/**/*.test.ts',
        '!src/common/**/*.d.ts',
    ],
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: path.join(configDir, 'tsconfig.test.json'),
                useESM: false,
            },
        ],
    },
};
