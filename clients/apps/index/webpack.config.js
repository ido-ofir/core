var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'build');
var appPath = path.resolve(__dirname, 'app');
var entry = path.resolve(appPath, 'init.jsx');
var corePath = path.resolve(__dirname, '../../core');

var config = {

    entry : {
        app : [ entry ]   // this array is modified by devServ.js in dev
    },

    devtool : 'eval',

    output: {
        path : path.join(__dirname, 'build'),
        filename : 'bundle.js',
        publicPath: '/build/'
    },

    plugins : [
        new webpack.optimize.CommonsChunkPlugin(
            "vendor",   // chunkName
            "vendor.bundle.js",  // filename
            function (module, count) {    // include all modules not in 'appPath' folder in the vendor bundle
                return (module.resource && module.resource.indexOf(appPath) === -1);;
            }
        ),
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        // new webpack.ProvidePlugin({   // the 'core' module is global
        //     core: corePath
        // })
    ],
    resolve: {
        root: appPath,
        alias: {   // use require('core') anywhere
          core: corePath  // use require('core') anywhere
        }
    },
    module : {
        loaders : [
            // {
            //     test : /\.css$/,
            //     loader : 'style-loader!css-loader'
            // },
            // {
            //     test : /\.scss$/,
            //     loader : 'style-loader!css-loader!sass-loader'
            // },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query:
                {
                  presets:['react','es2015', 'stage-0']
                }
            },
            { test: /.png$/, loader: "url?mimetype=image/png" },
            // { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
            // { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
            // { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
            // { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" }
        ]
    },
    // resolve: {
    //     // you can now require('file') instead of require('file.js')
    //     extensions: ['', '.js', '.jsx']
    // }
};


module.exports = config;
