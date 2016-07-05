var Emitter = require('./Emitter.js');
var Promise = require('./Promise.js');
var debounce = require('./debounce.js');
var uuid = require('./uuid.js');
var animation = require('./animation.js');
var immutableMerge = require('./immutableMerge.js');

function stringify(data){
  try {
    return JSON.stringify(data);
  } catch (e) {
    console.error(e);
  }
}

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

// clone [source] and exclude all property names in following arguments.
function except(source, ...args) {
  var target = {};
  for(var m in source){
    if(args.indexOf(m) === -1) target[m] = source[m];
  }
  return target;
}

// immutably set [path] on [source] to [value].
// if [value] is different then the current value a new object is returned
// and all the sub objects or arrays that contained the change are cloned as well.
// if [value] was not changed [source] is returned.
function set(source, path, value){
  var result = Array.isArray(source) ? [ ...source ] : { ...source };
  var target = result;
  if(typeof path === 'string'){
    path = path.split('.');
  }
  var property = path.pop();
  path.map((t, i) => {
    target[t] = Array.isArray(target[t]) ? [ ...target[t] ] : { ...target[t] };
    target = target[t];
  });
  if(target[property] === value){ // if nothing changed return the source
    return source;
  }
  target[property] = value;
  return result;
}

// deep check for equality. don't use objects with circular reference.
function equals(a, b){
  var ta = typeof a;
  var tb = typeof b;
  if(ta !== tb) return false;
  if(ta === 'object'){
    if(Array.isArray(a)){
      if(a.length !== b.length) return false;
      if(!a.length) return true;
      for (var i = 0; i < a.length; i++) {
        if(!equals(a[i], b[i])) return false;
      }
      return true;
    }
    else{
      if(Object.keys(a) !== Object.keys(b)) return false;
      for(var m in a){
        if(!equals(a[m], b[m])) return false;
      }
      return true;
    }
  }
  else{
    return a === b;
  }
}





module.exports = {
  stringify: stringify,
  parse: parse,
  find: find,
  set: set,
  merge: merge,
  except: except,
  equals: equals,
  immutableMerge: immutableMerge,
  debounce: debounce,
  uuid: uuid,
  animation: animation,
  Emitter: Emitter,
  Promise: Promise
};
