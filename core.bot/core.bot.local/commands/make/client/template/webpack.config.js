

var webpack = require('webpack');
var path = require('path');

var entry = path.resolve(__dirname, 'source/App.jsx');

var config = {

    entry : {
        app : [ entry ]
    },

    devtool : 'eval',

    output: {
        path : path.join(__dirname, 'build'),
        filename : 'bundle.js',
        publicPath: '/build/'
    },

    plugins : [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
            minChunks(module, count) {    // include all modules not in 'appPath' folder in the vendor bundle
                return (module.resource && (module.resource.indexOf(path.join(__dirname, 'source')) === -1));
            }
        }),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),
        // new webpack.ProvidePlugin({   // the 'core' module is global
        //     core: corePath
        // })
    ],
    module : {
        loaders : [
            {
                test : /\.css$/,
                loader : 'style-loader!css-loader'
            },
            {
                test : /\.scss$/,
                loader : 'style-loader!css-loader!sass-loader'
            },
            {
                test: /^(?:(?!module\.jsx$).)*\.jsx?$/,  // .jsx but not .module.jsx
                exclude: /node_modules/,
                loader: 'babel-loader',
                query:
                {
                  presets:['react','es2015', 'stage-0']
                }
            },
            {
                test: /\.module.jsx?$/,  // just module.js
                exclude: /node_modules/,
                loader: 'babel-loader',
                query:
                {
                  presets:['client-core','es2015', 'stage-0']
                }
            },
            { test: /.png$/, loader: "url?mimetype=image/png" },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    // resolve: {
    //     // you can now require('file') instead of require('file.js')
    //     extensions: ['', '.js', '.jsx']
    // }
};


module.exports = config;
