// webpack.config.js
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        index: './src/main.ts',
        nestServer: '@zernikalos/nestserver'
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
    // externals: [
    // ],
    resolve: {
        extensions: ['.ts', '.js','.json', '.!*.d.ts'],
        mainFields: ['main', 'module', 'jsnext:main', 'jsnext'],
        // symlinks: true,
        modules: [
            path.resolve(__dirname, 'node_modules'),
            'node_modules',
            path.resolve(__dirname, '../..', 'node_modules'),
        ],
    },
    module: {
        rules: [
            // {
            //     // We're specifying native_modules in the test because the asset relocator loader generates a
            //     // "fake" .node file which is really a cjs file.
            //     test: /native_modules[/\\].+\.node$/,
            //     use: 'node-loader',
            // },
            // {
            //     test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
            //     parser: { amd: false },
            //     use: {
            //         loader: '@vercel/webpack-asset-relocator-loader',
            //         options: {
            //             outputAssetBase: 'native_modules',
            //         },
            //     },
            // },
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
    // optimization: {
    //     minimize: false,
    // },
    mode: "development",
};