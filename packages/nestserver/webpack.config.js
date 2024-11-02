const webpack = require('webpack');
const path = require('path');

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
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    babelLoaderRule,
                    tsLoaderRule
                ],
                exclude: [/node_modules/]
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
        symlinks: true
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
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
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js',
        library: {
            type: "commonjs2"
        }
    },
};

module.exports = config