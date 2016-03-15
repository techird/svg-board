var webpack = require('webpack');
var path = require("path");

module.exports = {
    entry: ['babel-polyfill', './index.tsx'],

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader!ts-loader'
            }
        ]
    },
	output: {
        filename: 'index.js',
        path: "./static/"
	},
    resolve: {
        extensions: ['', '.jsx', '.js', '.tsx', '.ts']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        })
    ]
};
