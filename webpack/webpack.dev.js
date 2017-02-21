var webpack = require('webpack');
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var commonEntry = ['react-hot-loader/patch', 'webpack-hot-middleware/client?path=http://localhost:8081/__webpack_hmr'];

module.exports = {
    devtool: 'sourcemap',
    entry: {
        'index': commonEntry.concat(['./index.tsx']),
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ['react-hot-loader/webpack', 'ts-loader']
            },
            {
                test: /\.less$/,
                loader: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.html$/,
                loader: ['html-loader']
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: __dirname + "/static/",
        publicPath: "/"
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
        extensions: ['.jsx', '.js', '.tsx', '.ts']
    }
};
