const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');

const ROOT_PATH = path.join(__dirname, '.');
const INDEX_DIR = 'index.ts';

const tsLoaderRule = {
  loader: 'ts-loader'
};

function config({libraryName, entryName, packageName}) {
  const packageDir = path.join(ROOT_PATH, 'packages', packageName);
  const entries = [path.join(packageDir, INDEX_DIR)];
  const outputPath = path.join(packageDir, 'dist');

  const config = {
    mode: 'development',
    devtool: debug ? "inline-sourcemap" : null,
    entry: {
      [entryName]: entries
    },
    output: {
      path: outputPath,
      filename: "[name].js",
      library: libraryName,
      libraryTarget: 'umd',
      libraryExport: 'default',
      umdNamedDefine: true,
    },
    plugins: debug ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
    ],
    resolve: {
      extensions: ['.ts', '.js'],
      symlinks: true
    },
    devServer: {
      host: '0.0.0.0',
      port: 8080,
      progress: true,
      headers: {
          'Access-Control-Allow-Origin': '*'
      }
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
            test: /\.ts?$/,
            use: [
                tsLoaderRule
            ],
            exclude: []
        }
      ]
      },


  };
  return config;
}

module.exports = config({libraryName:'MrRobotto', entryName:'mrrobotto-core', packageName: 'core'});