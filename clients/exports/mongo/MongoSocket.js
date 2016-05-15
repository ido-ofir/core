
var q = require('q');

module.exports = function (onopen, actions) {

  actions = actions || {};

  var ws = new WebSocket('ws://localhost:3000');
  var requests = [];
  var id = 0;
  var queue = [];
  var connected = false;


  ws.onmessage = function(msg){
    var json = JSON.parse(msg.data);
    if(json.type && actions[json.type]) actions[json.type](json.data);  // action was initiated by the server
    else {  // action is initiated by the client, return to callback
      for (var i = 0; i < requests.length; i++) {
        if(requests[i].id === json.id){
          if(requests[i].cb) requests[i].cb(json.error, json.data);
          if(json.error) requests[i].promise.reject(json.error);
          else requests[i].promise.resolve(json.data);
          return requests.splice(i, 1);
        }
      }
    }
  };
  ws.action = function(type, data, cb){
    id += 1;
    var deffered = q.defer();
    if(data instanceof Function) {
      cb = data;
      data = {};
    }
    var request = {
      type: type,
      data: data,
      id: id,
      cb: cb
    };

    ws.send(JSON.stringify(request));
    request.promise = deffered;
    requests.push(request);
    return deffered.promise;
  };


  ws.onopen = function(){
    connected = true;
    queue.map(cb => cb())
    if(onopen) onopen();
  };
  ws.run = function(cb){
    if(!connected) return queue.push(cb);
    cb();
  }
  return ws;
}
