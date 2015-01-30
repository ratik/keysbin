var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");;

module.exports = {
    cache: true,
    entry: {
        'main': ['main'], // Contains app code
        'libs': 'libs' // Contains all libraries
    },
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[chunkhash].[id].js'
    },
    module: {
        // loaders list http://webpack.github.io/docs/list-of-loaders.html
        loaders: [{
                test: /\.json$/,
                loader: "json-loader"
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            //      { test: /\.css$/, loader: "style!css" },
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
    node: {
        fs: "empty"
    },
    plugins: [
            new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ "libs", /* filename= */ "js/libs.bundle.js"),
            new ExtractTextPlugin("assets/[name].css"),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                _crypto: "crypto"
            })
        ]
        /*,
        plugins: [
            new webpack.ResolverPlugin(
                    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(
                            'bower.json', ['main'])
                    ),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                pkg: require('./package.json'),
                title: '',
                template: './src/index.html'
            })
        ]/**/
};
