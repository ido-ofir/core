
var async= require('async');
function Args(args){
  return [].slice.call(args);
}
function isFunction(f){
  return (f instanceof Function);
}

function Action(path, request, callback){

  this.path = path;
  this.request = request;
  this.user = request.user;
  this.resolve = callback;
  this.actions = [];
  this.isDone = false;
}

Action.prototype = {
  run(path, data, cb){ /// try catch

    if(typeof path === 'string'){
      path = path.split('.');
      if(!path[1]) path = path[0].split('/');
    }
    if(!data) data = {};
    var parent = this;
    var request = {
      body: data,
      user: this.user
    };
    var child = core.actions.run(path, request, function(err, res){
      if(err) return parent.fail(err);
      cb(res);
    });
    this.actions.push(child);
  },
  ensure(obj, cb){
    var type, param, body = this.request.body;
    var params = [];
    for(var m in obj){
      if(!(m in body)) return this.fail(`parameter ${m} is missing.`);
      param = body[m];
      type = Array.isArray(param) ? 'array' : typeof param;
      if(type !== obj[m]) return this.fail(`parameter ${m} is of wrong type. expected '${obj[m]}', got '${type}..'`);
      params.push(param);
    }
    cb.apply(null, params);
  },
  done(data){
    this.response = data;
    this.isDone = true;
    this.resolve(null, data);
  },
  fail(data){
    if(typeof data !== 'object'){
      data = { type: 'fail', data: data };
    }
    this.response = data;
    this.resolve(data);
  },
  reject(reject){
    this.fail({ type: 'reject', data: reject });
  },
  error(error){
    this.fail({ type: 'error', data: error });
  },
  authorize(){
    
  }
};
module.exports = Action;
