const webpack = require('webpack');
const path = require('path');
const { fromRoot, createAppAliases } = require('../studio-paths.cjs');

module.exports = {
    context: fromRoot('electronapp'),
    entry: {
        index: './src/main.ts',
    },
    target: 'electron-main',
    output: {
        path: fromRoot('electronapp', 'dist', 'main'),
        filename: '[name].js',
        library: {
            type: 'commonjs2',
        },
    },
    devtool: 'inline-source-map',
    externals: {},
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            ...createAppAliases(fromRoot('electronapp', 'src')),
            '@zstudio-server': fromRoot('nestserver', 'dist', 'main.js'),
        },
        mainFields: ['main', 'module', 'jsnext:main', 'jsnext'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: fromRoot('config', 'tsconfigs', 'tsconfig.electronapp.json'),
                    },
                },
                exclude: [/node_modules/, /\.d\.ts$/],
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [],
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.IgnorePlugin({
            checkResource(resource) {
                const lazyImports = [
                    '@nestjs/microservices',
                    '@nestjs/platform-socket.io',
                    '@nestjs/websockets/socket-module',
                    '@nestjs/microservices/microservices-module',
                    'bufferutil',
                    'utf-8-validate',
                ];
                if (!lazyImports.includes(resource)) {
                    return false;
                }
                try {
                    require.resolve(resource);
                } catch (err) {
                    return true;
                }
                return false;
            },
        }),
    ],
    optimization: {
        minimize: false,
    },
    mode: 'development',
};
