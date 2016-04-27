
var net = require('net');

var port = 4444;
var clients = [];
var alive = false;
module.exports = function(cb){
  try {
    var server = net.createServer(function (socket) {
      socket.on('close', function(err){
        if(err) console.log('socket closed by error');
        clients.splice(clients.indexOf(socket), 1);
      });
      socket.on('data', function(data){
        clients.forEach(function(c){
          c.write(data);
        });
      });
      clients.push(socket);
    });

    server.listen(port, function() {
      console.log("cloud server on port", port);
      cb();
    });
  } catch (e) {
    cb();
  }
}
