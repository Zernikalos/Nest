/** @type {import('jest').Config} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.d.ts'],
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: '../config/tsconfigs/tsconfig.ide-core.test.json',
                useESM: false,
            },
        ],
    },
};
