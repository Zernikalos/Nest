// webpack.config.js
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        main: './src/main.ts',
        nestServer: '@zernikalos/nestserver'
    },
    target: 'electron-main',
    output: {
        path: path.resolve(__dirname, '.webpack'),
        filename: '[name]',
    },
    devtool: 'inline-source-map',
    externals: [
    ],
    resolve: {
        extensions: ['.ts', '.js','.json', '.!*.d.ts'],
        mainFields: ['main', 'module', 'jsnext:main', 'jsnext'],
        symlinks: true,
        modules: [
            path.resolve(__dirname, 'node_modules'),
            'node_modules',
            path.resolve(__dirname, '../..', 'node_modules'),
        ],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
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