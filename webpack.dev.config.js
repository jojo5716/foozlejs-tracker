const open = require('open');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {

    // Webpack entry point scripts (those scripts explicitly included in the html):
    // Relative to context path
    entry: {
        index: ['./example']
    },

    // Webpack output config
    output: {
        // A filename pattern for the output files
        filename: '[name].js',

        // An absolute path to the desired output directory.
        path: 'example/__dist__',

        publicPath: '/__dist__/'
    },

    module: {
        loaders: [
            // Compile React compoments from Babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel']
            },

            // extract less files
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
        new DashboardPlugin()
    ],

    devServer: {
        contentBase: './example',
        inline: true,
        colors: true,
        setup: app => {
            // Here we customize a validation endpoint to test field validation in development
            //
            // To test the call in development, we always return an error
            // no matter what the field is or has.
            // More logic can be added if we need to return different values dependin on the field name
            // or the field value
            app.post('/validate/', (request, response) => {
                response.json({error: false, msg: `This is a test error` });
            });

            // Returns the post data received by the server
            app.post('/', (request, response) => {
                let fullBody = '';
                request.on('data', chunk => fullBody += chunk.toString());
                request.on('end', () => response.send(fullBody));
            });
        },
    }

};
//
// Open the example in the browser
//open('http://localhost:8888');
