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
    target: 'electron-main',
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
                //exclude: [/node_modules/]
            }
        ]
    },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        symlinks: true
    },
    // experiments: {
    //     outputModule: true
    // },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        new webpack.IgnorePlugin({
            checkResource(resource) {
                const lazyImports = [
                    '@nestjs/microservices',
                    '@nestjs/microservices/microservices-module',
                    //'@nestjs/platform-express',
                    '@nestjs/grahpql',
                    'cache-manager',
                    'class-validator',
                    'class-transformer',
                    'graphql'
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
        filename: 'main.js',
        //chunkFormat: "module",
        library: {
            type: "umd"
        }
    },
};

module.exports = config
