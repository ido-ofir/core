
var root = 'webint';

var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'build');
var componentPath = path.resolve(__dirname, 'component');
var entry = path.resolve(__dirname, 'App.jsx');

var array = __dirname.split(`${root}${path.sep}clients`);
if(!array[1]) return console.error(`cannot find core path from ${__dirname}`);
var corePath = path.join(array[0], `${root}${path.sep}clients`, 'core');
var exportsPath = path.join(array[0], `${root}${path.sep}clients`, 'exports');

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
                return (module.resource && module.resource.indexOf(__dirname) === -1);;
            }
        ),
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        // new webpack.ProvidePlugin({   // the 'core' module is global
        //     core: corePath
        // })
    ],
    resolve: {
        alias: {
          core: corePath  // use require('core') anywhere
        },
        root: exportsPath   // treat the 'exports' directory like node_modules
    },
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
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query:
                {
                  presets:['react','es2015', 'stage-0']
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
