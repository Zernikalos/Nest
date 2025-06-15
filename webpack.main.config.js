// webpack.config.js
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        index: './electronapp/main.ts',
    },
    target: 'electron-main',
    output: {
        path: path.resolve(__dirname, 'dist/main'),
        filename: '[name].js',
        library: {
            type: 'commonjs2'
        }
    },
    devtool: 'inline-source-map',
    externals: {
        '@nestserver': `commonjs ../server/main`,
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '@nestserver': '../server/main',
        },
        mainFields: ['main', 'module', 'jsnext:main', 'jsnext'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
        ],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.electron.json'),
                    }
                },
                exclude: [
                    /node_modules/,
                    /\.d\.ts$/,
                ],
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: []
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
                    'utf-8-validate'
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
    mode: "development",
};