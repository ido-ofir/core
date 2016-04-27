
var Ajax = require('./ajax');
var Socket = require('./socket');
var Emitter = require('../utils/Emitter.js');
var utils = require('./utils.js');

// config: { domain: 'localhost', port: 4000, autoConnect: false }
// options: { fail(){} }

module.exports = function(config, options){
  config = config || {};
  options = options || {};
  var ajax = Ajax(config, options);
  var socket = Socket();
  var connected = false;
  var noFail = options ? options.fail : (any)=>{ console.error(any); };

  var connection = Emitter({
    ajax: ajax,
    config(_config){
      for(var m in _config){
        config[m] = _config[m];
      }
    },
    getAccessToken: ajax.getAccessToken,
    connect(success, fail){
      if(!fail) fail = noFail;
      socket.connect(`${config.domain}:${config.port}`, (message)=>{
        var msg = utils.parse(message);
        if(msg || msg.type){
          if(msg.type === 'response') socket.response(msg);
          else if(msg.type === 'authorize') {
            connected = true;
            connection.emit('connect');
            if(success) success();
            else console.log(`connected to ${config.domain}:${config.port}`);
          }
          else connection.emit(msg.type, msg.data, msg);
        }
      }, ()=>{
        connection.emit('disconnect');
      });

      setTimeout(function(){
        if(!connected){
          if(fail) fail(`could not connect to ${config.domain}:${config.port}`);
          else console.error(`could not connect to ${config.domain}:${config.port}`);
        }
      }, 5000)
    },
    action(path, data, success, fail){
      if(!path) return fail('cannot request action, path parameter is not valid');
      if(typeof path === 'string'){
        path = path.split('.');
        if(path.length === 1) path = path[0].split('/');
      }
      if(typeof data === 'function'){
        fail = success;
        success = data;
        data = {};
      }
      ajax.action(path, data, success, fail);
    }
  });
  if(config.autoConnect) connection.connect();
  return connection;
};
