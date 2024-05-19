const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const babelLoaderRule = {
    loader: 'babel-loader',
    options: {
        cacheDirectory: true,
        //configFile: path.join(ROOT_PATH, 'babel.config.js')
    }
};

const tsLoaderRule = {
    loader: 'ts-loader'
}

const config = {
    entry: ['./src/main.ts'],
    target: 'node',
    externals: [
        nodeExternals()
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    babelLoaderRule,
                    tsLoaderRule
                ],
                exclude: []
            },
            {
                test: /\.js?$/,
                use: [
                    babelLoaderRule
                ],
                exclude: [/node_modules/]
            }
        ]
    },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        // symlinks: true
    },
    experiments: {
        outputModule: true
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.IgnorePlugin({
        //     checkResource(resource) {
        //         const lazyImports = [
        //             '@nestjs/microservices',
        //             // '@nestjs/websockets',
        //             '@nestjs/websockets/socket-module',
        //             // '@nestjs/platform-express',
        //             '@nestjs/microservices/microservices-module',
        //             // 'cache-manager',
        //             // 'class-validator',
        //             // 'class-transformer'
        //         ];
        //         if (!lazyImports.includes(resource)) {
        //             return false;
        //         }
        //         try {
        //             require.resolve(resource);
        //         } catch (err) {
        //             return true;
        //         }
        //         return false;
        //     },
        // }),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'server.js',
        chunkFormat: "module",
        library: {
            type: "module"
        }
    },
};

module.exports = config