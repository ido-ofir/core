var Action = require('./Action.js');
var url = require('url');
var request = require('request');

function sequence(action, listeners, cb){  // run all listeners, passing action. call action.next() to continue.
  if(!listeners) return cb();
  var i = listeners.length;
  if(!i) return cb();
  function run(){
    i--;
    var f = listeners[i];
    action.next = i ? run : cb;
    f(action);
  }
  run();
}

function serialize(action){
  var actions = action.actions.map(function(action){
    return serialize(action);
  });
  var request = action.request;
  var response = action.response;
  return {
    isDone: action.isDone,
    path: action.path,
    request: {
      body: request.body,
      headers: request.headers
    },
    response: action.response,
    actions: actions
  };
}

module.exports = function(core){

  var before = {};
  var after = {};
  var methods = {};

  function find(target, path){
    if(!target || !path) return;
    var name = path.shift();
    if(target[name] instanceof Function) return { target: target, name: name, value: target[name], internalPath: path.join('/') };
    return find(target[name], path);
  }

  var actions = {
    define(name, method){
      methods[name] = method;
    },
    load(obj){
      for(var m in obj){
        methods[m] = obj[m];
      }
    },
    run(path, request, callback){
        if(typeof path === 'string'){
          path = path.split('.');
          if(!path[1]) path = path[0].split('/');
        }
        var data = request.body;
        var user = request.user;
        var id, action, method, found = find(methods, path);
        if(!found) return null;
        id = path.join('.');
        action = new Action(path, request, function(err, data){
          if(err) return callback(err);
          sequence(action, after[id], function(){
            callback(null, action.response);
          });
        });
        action.internalPath = found.internalPath;
        process.nextTick(function(){   // for supporting sync calls
          sequence(action, before[id], function(){
            found.target[found.name](action);  // call method with context
          });
        });
        return action;
    },
    before(path, listener){
      if(Array.isArray(path)) path = path.join('.');
      if(typeof path !== 'string'){
        return console.error(`path is not valid - ${path}`);
      }
      if(!before[path]) before[path] = [];
      before[path].push(listener);
    },
    after(path, listener){
      if(Array.isArray(path)) path = path.join('.');
      if(typeof path !== 'string'){
        return console.error(`path is not valid - ${path}`);
      }
      if(!after[path]) after[path] = [];
      after[path].push(listener);
    },
    serialize(action){
      var serial = serialize(action);
      serial.user = action.user;
      return serial;
    },
    redirect(targetUrl){
      var parsed = url.parse(targetUrl);
      var protocol = parsed.protocal || 'http';
      var host = parsed.host;
      var port = parsed.port || 80;
      var auth = parsed.auth || '';
      var pathname = parsed.pathname || '/';

      return function(action){
        var internalPath = action.internalPath || '';
        var formated = url.format({
          protocol: protocol,
          host: host,
          port: port,
          auth: parsed.auth,
          pathname: `/actions${pathname}${internalPath}`
        });
        request.post(formated, {form: action.request.body}, function (error, response, body) {
          if(error) return action.error(error);
          // console.dir(body);
          if (response.statusCode !== 200) {
            return action.fail(`${formated} responded with status code ${response.statusCode}`);
          }
          var json = JSON.parse(body);
          // console.dir(json);
          if(json.success){
            action.done(json.data);
          }
          else{
            action.fail(json.data);
          }
        });
      };
    }
  };

  return actions;
}
