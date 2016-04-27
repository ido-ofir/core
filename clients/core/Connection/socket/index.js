
/*

  socket module initializes and returns a socket that attempts to connect to 'url'.
  it adds a 'socket.json(obj)' method to send json.
  it also adds a 'socket.request(method, data, callback)' which will execute 'method' on the server and return the result to 'callback'.

  whenever the socket recieves a message with a 'type' property -  it will emit an event with that type.
  for example if the socket recieves {type: 'koko', ... } - it will emit an event called 'koko'.

*/


// var Socket = require('engine.io-client');
var utils = require('../utils.js');
var Request = require('./request.js');
var Action = require('./action.js');
var Emitter = require('../../utils/Emitter.js');

module.exports = function(){

  var connected = false;
  var reconnect = true;
  var socket;

  var layer = Emitter({
    json(obj){   // send obj as json.
      var str = utils.stringify(obj);
      if(str) socket.send(str);
    },
    connect(url, onMessage, onClose){
      if(connected) return true;
      reconnect = true;
      if(url.indexOf('ws://') !== 0) url = ('ws://' + url);
      socket = new WebSocket(url);
      socket.onopen = function(){
        connected = true;
        // console.log('socket opened');
        socket.onmessage = function(e){
          var data = e.data;
          if(onMessage) onMessage(data);
          layer.emit('message', data);
        };
        layer.emit('connect');
      };
      socket.onclose = function(){
        connected = false;
        console.log('socket closed.');
        if(onClose) onClose();
        if(reconnect){
          console.log('reconnecting..')
          setTimeout(function(){
            layer.connect(url, onMessage);
          },1000)
        }
        layer.emit('close');
      };
    },
    exec(type, data){
      if(!connected) {
        console.error(`failed to send ${type}. socket is closed:`);
        console.dir(data);
      }
      console.log(`sending ${type}`);
      layer.json({
        type: type,
        data: data
      });
    },
    disconnect(){
      reconnect = false;
      socket.close();
    },
    isConnected(){
      return connected;
    }
  });

  layer.request = Request(layer);   // sends type 'request', listens for type 'response'
  layer.action = Action(layer);
  return layer;
}
