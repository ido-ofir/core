var Emitter = require('./Emitter.js');
var Promise = require('./Promise.js');
var debounce = require('./debounce.js');

function parse(data){
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
}

function find(id, array, field){
  if(!id) return false;
  field = field || 'id';
  id = id.toString();
  for (var i = 0; i < array.length; i++) {
      if(array[i][field]){
      if(array[i][field].toString() === id) return array[i];
    }
  }
}

function merge(){
  var result = {};
  var obj;
  for (var i = 0; i < arguments.length; i++) {
    obj = arguments[i];
    for(var m in obj) result[m] = obj[m];
  }
  return result;
}

function except(source, ...args) {
  var target = {};
  for(var m in source){
    if(args.indexOf(m) === -1) target[m] = source[m];
  }
  return target;
}

module.exports = {
  parse: parse,
  find: find,
  merge: merge,
  except: except,
  debounce: debounce,
  Emitter: Emitter,
  Promise: Promise
};
