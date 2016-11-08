var webpack = require('webpack');
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var commonEntry = ['webpack-hot-middleware/client?path=http://localhost:8081/__webpack_hmr', 'babel-polyfill'];

module.exports = {
    devtool: 'sourcemap',
    debug: true,
    entry: {
        'index': commonEntry.concat(['./index.tsx']),
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
            {
                test: /\.html$/,
                loader: 'html'
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: __dirname + "/static/",
        publicPath: "/",
        include: __dirname
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    resolve: {
        extensions: ['', '.jsx', '.js', '.tsx', '.ts']
    }
};
