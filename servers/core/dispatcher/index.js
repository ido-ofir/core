
var net = require('net');
var port = 4444;

module.exports = function(){
  var client = net.connect({port: port}, function() { //'connect' listener
    console.log('dispatcher connected to cloud');
  });
  client.on('end', function() {
    console.log('dispatcher disconnected from cloud');
  });
  client.on('data', function(data) {
    if(data.type){
      client.emit(data.type, data.data);
    }
  });
  client.dispatch = function(type, data){
    client.write({
      type: type,
      data: data
    });
  };
  return client;
}
