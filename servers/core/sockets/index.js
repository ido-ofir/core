var http = require('http');
var Socket = require('./socket.js');
var WebSocketServer = require('ws').Server;

module.exports = function(app){
  var httpServer = http.createServer(app);
  var server = new WebSocketServer({ server: httpServer })
  var sockets = server.sockets = [];

  server.authorize = function(socket){
    socket = Socket(socket);  // socket will now emit 'request' events when a valid request arrives.
    sockets.push(socket);
    socket.on('action', function(request){
      server.emit('action', socket, request);
    });
    socket.on('close', function(){
      sockets.splice(sockets.indexOf(socket), 1);
    });
    server.emit('authorize', socket);
  };
  
  server.broadcast = function(any){
    sockets.map(function(socket){
      socket.json(any);
    });
  };

  server.fire = function(type, data){
    server.broadcast({
      type: type,
      data: data
    });
  };

  server.disconnectOrigin = function(origin){
    sockets.forEach(function(socket){
      if(socket.request.headers.origin === origin){
        socket.close();
      }
    })
  }

  server.listen = httpServer.listen.bind(httpServer);
  return server;
};
