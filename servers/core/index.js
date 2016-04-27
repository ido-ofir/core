

var express = require('express');
var path = require('path');
var repl = require('repl');

var Bootstrap = require('./bootstrap');
// var Api = require('./api');
var Sockets = require('./sockets');
var Actions = require('./actions');
var Schemas = require('./schemas');
var Dispatcher = require('./dispatcher');
var Loggers = require('./loggers');
var utils = require('./utils');
// var winston = require('winston');
var masterConfig = require('../../config.json');

var logLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];  // this is the order of log levels.
// var context = repl.start('> ').context;


function removeEmptyStringFilter(item){ return item; }

module.exports = function(config, middlewares){

  config.master = masterConfig;

  var bootstrap = Bootstrap();
  var app = express();
  var sockets = Sockets(app, config);
  var loggers = Loggers(config.app.loggers);

  // context.loggers = loggers;

  /*

    logger.error('error');
    logger.warn('warn');
    logger.info('info');
    logger.verbose('verbose');
    logger.debug('debug');
    logger.silly('silly');

  */

  // var dispatcher = Dispatcher();   //  dispatch and recive action reports from all servers in the cloud.
  var core = global.core = utils.Emitter({
    utils: utils,
    app: app,
    config: config,
    sockets: sockets,
    loggers: loggers
  });

  var actions = core.actions = Actions(core);

  // override core.authorize to return custom data to users after successful login
  core.authorize = function(socket, done){
    done(socket.user);
  };

  for(var m in middlewares){
    app.use(m, middlewares[m]);
  }

  app.use(bootstrap);  // normal express bootstrap.

  function useClient(url, client){
    var dir = path.resolve(__dirname, '../../clients/views', client);
    console.log(`using ${url} ${dir}`);
    app.use(url, express.static(dir));
  }

  if(config.app.client){
    useClient('/', config.app.client);
  }
  else if(config.app.clients){
    for(var m in config.app.clients){
      useClient(m, config.app.clients[m]);
    }
  }
  else{
    app.use('/', express.static(path.resolve(__dirname, '../../clients/views')), function(req, res, next){
      if(req.url === '/') return res.redirect('/index');
      next();
    });
  }


  app.use('/actions', function(req, res, next){
    var path = req.url.split('/').filter(removeEmptyStringFilter);
    var action = actions.run(path, req, function(err, data){   // run an action for this path
      core.sockets.broadcast({
        type: 'core.action',
        data: actions.serialize(action)
      });
      res.callback(err, data);
    });
    if(!action) next();
  });

  sockets.on('action', function(request, socket){

  });
  sockets.on('connection', function (socket) {           // fired for every incoming socket connection.
    sockets.authorize(socket);
  });

  sockets.on('authorize', function(socket){              // this socket has passed authentication and socket.user is the user of the socket.
    core.authorize(socket, function(data){              // override core.authorize in your app code
      socket.json({                       // this is the first message an authenticated socket will recieve.
        type: 'authorize',
        data: data
      });
    });
  });
  sockets.listen(config.app.port, function(){         // start the server
      loggers.core.info("listening at " + config.app.domain + ":" + config.app.port);
      core.emit('online');
  });
  return core;
}
