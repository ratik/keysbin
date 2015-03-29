var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");;

module.exports = {
    cache: true,
    entry: {
        'main': ['main'],
        'libs': 'libs'
    },
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[chunkhash].[id].js'
    },
    module: {
        loaders: [{
                test: /\.json$/,
                loader: "json-loader"
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.(png|jpg|gif|woff2|woff|eot|ttf|svg)$/,
                loader: "file-loader?name=assets/[hash].[ext]"
            }, {
                test: /index[a-z-]*\.html\.jade$/,
                loader: "file-loader?name=[path][name]&context=./src!jade-html-loader"
            }, {
                test: /views\/.*\.html$/,
                loader: "html"
            }, {
                test: /index.html$/,
                loader: "file-loader?name=[path][name].html&context=./front"
            }
        ]
    },
    resolve: {
        alias: {
            bootstrap_npm: path.join(__dirname, 'node_modules/bootstrap/dist')
        },
        extensions: ['', '.js', '.json', '.css', '.html'],
        root: [
            path.join(__dirname, 'front'),
            path.join(__dirname, 'node_modules')
        ],
        moduleDirectories: [
            'node_modules'
        ]
    },
    externals: {
        'node-localstorage': true,
        'crypto': true,
        'openpgp': true
    },
    plugins: [
            new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ "libs", /* filename= */ "js/libs.js", Infinity),
            new ExtractTextPlugin("assets/[name].css"),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            })
        ]
};
