module.exports = function(socket){
  var id = 0;
  var requests = [];
  socket.response = function(msg){
    if(!msg.id) return console.error('socket got a response with no id');
    var method;
    for (var i = 0; i < requests.length; i++) {
      if(requests[i].id === msg.id){
        method = requests[i];
        requests.splice(i, 1);
        break;
      }
    }
    if(method) method(msg.response);
  };
  return function(type, data, callback){
    id += 1;
    callback.id = data.id = id;
    requests.push(callback);
    socket.exec(type, data)
  };
};
