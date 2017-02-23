var webpack = require('webpack');
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [ './index.tsx'],

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: ['ts-loader']
            },
            {
                test: /\.less$/,
                loader: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    output: {
        filename: 'index.js',
        path: "./static/"
    },
    resolve: {
        extensions: ['.jsx', '.js', '.tsx', '.ts']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
};
