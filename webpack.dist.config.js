const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports  = {
    // Webpack entry point scripts (those scripts explicitly included in the html):
    // Relative to context path
    entry: {
        index: ['./src/index.js'],
        'index.min': ['./src/index.js']
    },

    // Webpack output config
    output: {
        // An absolute path to the desired output directory.
        path: './dist/',

        // A filename pattern for the output files
        filename: '[name].js',

        // IMPORTANT!: This is the name of the global variable exported in browsers
        // Change it for the name you want your component to have as window.NAME
        library: 'FoozleJS',

        libraryTarget: 'umd'
    },

    module: {
        loaders: [
            // Compile React compoments from Babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },

            // extract less files
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
            }
        ]
    },

    plugins: [
        // Create a css file per each initial chunk
        new ExtractTextPlugin('[name].css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            compress: {
                warnings: false
            }
        })
    ],


    devtool: 'source-map'
};