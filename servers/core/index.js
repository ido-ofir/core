

var express = require('express');
var path = require('path');

// var Api = require('./api');
var Sockets = require('./sockets');
var Actions = require('./actions');
var utils = require('./utils');
var winston = require('winston');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

module.exports = function(config, middlewares){

  var app = express();
  var sockets = Sockets(app, config);

  winston.level = config.log;
  winston.default.transports.console.colorize = true;

  var core = global.core = utils.Emitter({
    utils: utils,
    app: app,
    config: config,
    sockets: sockets,
    log(){
      winston.info.apply(winston, arguments);
    }
  });

  var actions = core.actions = Actions(core);

  // override core.authorize to return custom data to users after successful login
  core.authorize = function(socket, done){
    done(socket.user);
  };

  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/', express.static(path.resolve(process.cwd(), 'clients/views')), function(req, res, next){
    if(req.url === '/') return res.redirect('/index');
    next();
  });

  app.use('/actions', function(req, res, next){
    var path = req.url.split('/').filter(n => n);
    var action = actions.run(path, req, function(err, data){   // run an action for this path
      res.json({
        success: !err,
        data: err || data
      });
    });
    if(!action) next();
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

  sockets.listen(config.port, function(){         // start the server
      core.log("listening at port " + config.port);
      core.emit('online');
  });

  return core;
}
