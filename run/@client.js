
var webpackDevMiddleware = require("webpack-dev-middleware");
var path = require('path');
var clientsPath = path.resolve(__dirname, `../clients/`);
var webpack = require('webpack');

module.exports = function(name){


  if(!name) name = 'app';
  var appPath = path.join(clientsPath, `apps/${name}`);
  var entry = path.join(appPath, 'App.jsx');

  var config = {

      entry : {
          app : [ entry ]
      },

      devtool : 'eval',

      output: {
          path : path.join(appPath, 'build'),
          filename : 'bundle.js',
          publicPath: '/build/'
      },

      plugins : [
          // new webpack.optimize.CommonsChunkPlugin(
          //     "vendor",   // chunkName
          //     "vendor.bundle.js",  // filename
          //     function (module, count) {    // include all modules not in 'appPath' folder in the vendor bundle
          //         return (module.resource && module.resource.indexOf(__dirname) === -1);;
          //     }
          // ),
          // new webpack.HotModuleReplacementPlugin(),
          // new webpack.NoErrorsPlugin(),
          // new webpack.ProvidePlugin({   // the 'core' module is global
          //     core: corePath
          // })
      ],
      resolve: {
          root: clientsPath   // treat the 'clients' directory like a node_modules directory
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
                  test: /^(?:(?!module\.jsx$).)*\.jsx?$/,  // .jsx but not .module.jsx
                  exclude: /node_modules/,
                  loader: 'babel',
                  query:
                  {
                    presets:['react','es2015', 'stage-0']
                  }
              },
              {
                  test: /\.module.jsx?$/,
                  exclude: /node_modules/,
                  loader: 'babel',
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

  // returns a Compiler instance
  var compiler = webpack(config);
  compiler.watch({ // watch options:
      // aggregateTimeout: 300, // wait so long for more changes
      // poll: true // use polling instead of native watchers
      // pass a number to set the polling interval
  }, function(err, stats) {
    console.log(err || stats);
      // ...
  });
};
