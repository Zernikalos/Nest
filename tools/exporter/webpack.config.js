const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');

const ROOT_PATH = path.join(__dirname, '.');
const INDEX_DIR = 'index.js';

const babelLoader = {
    loader: 'babel-loader'
};

function config({libraryName, entryName}) {
    const packageDir = ROOT_PATH;
    const entries = [path.join(packageDir, INDEX_DIR)];
    const outputPath = path.join(packageDir, 'dist');

    const config = {
        mode: 'development',
        entry: {
            [entryName]: entries
        },
        output: {
            path: outputPath,
            filename: "[name].js",
            library: libraryName,
            libraryTarget: 'umd',
            umdNamedDefine: true,
            libraryExport: 'default'
        },
        plugins: debug ? [] : [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
        ],
        resolve: {
            extensions: ['.ts', '.js'],
            symlinks: true
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    use: [
                        babelLoader
                    ],
                    exclude: [/node_modules/]
                }
            ]
        },


    };
    return config;
}

module.exports = config({libraryName: 'mrrexporter', entryName: 'mrrobotto-exporter'});
