const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.ts',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        library: {
            type: 'commonjs2'
        }
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.json'),
                        transpileOnly: false,
                    }
                },
                exclude: [
                    /node_modules/,
                ],
            },
        ],
    },
    plugins: [
        // Ignorar módulos opcionales de ws que no son necesarios
        new webpack.IgnorePlugin({
            checkResource(resource) {
                const optionalModules = ['bufferutil', 'utf-8-validate'];
                return optionalModules.includes(resource);
            },
        }),
    ],
    optimization: {
        minimize: false,
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    // No usar externals para generar un bundle completo
    // Nota: Los módulos nativos (como sqlite3, ws con bindings nativos) 
    // pueden necesitar ser excluidos si causan problemas
    externals: [],
    node: {
        __dirname: false,
        __filename: false,
    },
};
