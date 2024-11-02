// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.js','.json', '!*.d.ts'],
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../nestui/dist/index.html'),
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.join(__dirname, '../nestui/dist/assets'), to: 'assets' },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
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
                test: /\.(css|woff|woff2|ttf|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: '[hash][ext][query]'
                }
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env'],
            //         },
            //     },
            // },
            // {
            //     test: /\.css$/,
            //     use: [
            //         MiniCssExtractPlugin.loader,
            //         'css-loader'
            //     ],
            // },
            // {
            //     test: /\.css$/,
            //     loader: 'css-loader',
            //     options: {
            //         modules: {
            //             localIdentContext: path.join(__dirname, '../nestui/dist')
            //         },
            //     }
            // },
        ],
    },
};