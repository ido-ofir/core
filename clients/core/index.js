
var Core = require('./core-skeleton.js');
/**
 * @name clientCore
 */
var core = window.core = new Core({
    name: 'client-core',
    plugins: [
      require('./core_plugins/core.plugin.extend'),      
      require('./core_plugins/core.eventEmitter'),
      require('./core_plugins/core.injector'),
      require('./core_plugins/core.plugin.injector'),
      require('./core_plugins/core.getDefinitionObject'),
      require('./core_plugins/core.plugin.channels'),
      require('./core_plugins/core.plugin.hooks'),
      require('./core_plugins/core.plugin.imports'),
      require('./core_plugins/core.imports'),
      require('./core_plugins/core.Array'),
      require('./core_plugins/core.types'),
      require('./core_plugins/core.build'),
      require('./core_plugins/core.plugin.types'),
      require('./core_plugins/core.prepend'),
      require('./core_plugins/core.modules'),
      require('./core_plugins/core.components'),
      require('./core_plugins/core.actions'),
      require('./core_plugins/core.tree'),
      require('./core_plugins/core.bindings'),
      require('./core_plugins/core.views'),
      require('./core_plugins/core.templates'),
      require('./core_plugins/core.apps'),
      require('./core_plugins/core.plugins'),
      require('./core_plugins/core.plugin.modules'),
      require('./core_plugins/core.plugin.actions'),
      require('./core_plugins/core.plugin.tree'),
      require('./core_plugins/core.plugin.bind'),      
      require('./core_plugins/core.plugin.components'),
      require('./core_plugins/core.plugin.views'),
    ]
});

// core.Component('o', [], function(){
//   return {
//     render(){

//     }
//   };
// });

module.exports = core;

/*

function Core() {

  this.components = {};
  this.views = {};
  this.templates = {};
  this.actions = {};
  this.apps = {};
  this.events = {};
  this.plugins = {};
  
  this.utils = utils;
  this.constructor = Core;

}

Core.prototype = utils.Emitter({
  Array: utils.ArrayFind,
  types: types,
  
  isUndefined(v){ return core.typeOf(v) === 'undefined'; },
  isNull(v){ return core.typeOf(v) === 'null'; },
  isBoolean(v){ return core.typeOf(v) === 'boolean'; },
  isNumber(v){ return core.typeOf(v) === 'number'; },
  isString(v){ return core.typeOf(v) === 'string'; },
  isArray(v){ return core.typeOf(v) === 'array'; },
  isObject(v){ return core.typeOf(v) === 'object'; },
  isFunction(v){ return core.typeOf(v) === 'function'; },
  typeOf(thing){
    var type = Object.prototype.toString.call(thing);
    return type.substring(8, type.length -1).toLowerCase();
  },
  $_typeOf(thing){
    var type = this.typeOf(thing);
    return ((type === 'object') ? (thing['$_type'] || type) : type);
  },
  keys(object){
    var result = [];
    if(!object) return result;
    for(var m in object){
      result.push(m);
    }
    return result;
  },
  flatten(source, result){
    var isObject = core.isObject(source);
    var isArray = core.isArray(source);
    if(!isObject && !isArray){
      return source;
    }
    if(!result) result = {};
    var type = source['$_type'];
    if(type){
      if(!result[type]){
        result[type] = [];
      }
      result[type].push(source);
    }
    for(var m in source){
      core.flatten(source[m], result);
    }
    return result;
  },
  mapTypes(source){
    if(!source) source = this.source || {};
    var types, coreTypes = core.Array();
    for(var m in core.types){
      coreTypes.push(core.types[m]);
    }
    var flat = core.flatten(source);
    flat.type = (flat.type ? core.Array(coreTypes.concat(flat.type)) : coreTypes);
    return flat;
  },  
  isPrimitive(v){
    if(!v) return true;
    var type = core.typeOf(v)
    if(type === 'array'){ return false; }
    if(type !== 'object'){ return true; }
    var $_type = v['$_type'];
    if(!$_type){ return false; }
    if(['undefined', 'null', 'boolean', 'string', 'number'].indexOf($_type) > -1){
      return true;
    }
    return false;
  },
  emptyObject: {},
  emptyArray: [],
  emptyFunction(){},
  definitions: {},
  set(path, value){
    return this.tree.set(path, value);
  },
  get(path){
    return this.tree.get(path);
  },
  select(path){
    return this.tree.select(path);
  },
  
  options: {
    moduleNames(){
      return this.modules.map((m)=>{ return { key: m, value: m } });
    }
  },
  log(){

  },
  collect({ source, path, map, done }){

    

  },
  build (source, path, done) {

    var type, typeName, map, child, recursive, built, newTarget, ns, target;
    
    if(!done && this.isFunction(path)){
      done = path;
      path = [];
    }
    if(!done){ done = this.emptyFunction; }
    if(!source) {
      done(source);
      return source;
    }
    if(!path){ path = []; }
    
    if(path.length){ 
      ns = path.join('/');
      if(this.definitions[ns] === source) {  // if the source has not changed, stop here.
        done(source);
        return source;
      }
      this.definitions[ns] = source;  // if it did change, remember it and proceed.
    }

    map = {};
    typeName = source['$_type'];
    type = typeName ? this.types[typeName] : null;
    var recursive = type && type.recursive;
    if(recursive && core.isFunction(recursive)){ recursive = recursive(source); }
    if(type && type.preBuild){
      source = type.preBuild(source);
    }
    if(!type || type.recursive){  // build children.
      if(this.isObject(source)){
        target = {};      
        for(var m in source){
          target[m] = this.build(source[m], (path && path.concat([m])));
        }
      }
      else if(this.isArray(source)){
        target = [];
        for (var i = 0; i < source.length; i++) {
          child = this.build(source[i], (path && path.concat([i])));
          target.push(child);
        }
      }
    }
    else{
      target = source;
    }
    
    if(!typeName){  // not a typed entity.
      return target;
    }
    if(!type) throw new Error(`cannot find type '${typeName}'`);
    if(!type.build) throw new Error(`type '${typeName}' does not have a build method`);
    var built = type.build.call(this, target, path);
    done(built);
    return built;
  },
  extract(source, path){

    if(!this.isObject(source)){
      // return source;
      // console.debug('source', source);
      
    }
    if(!path) path = [];
    if(!this.isArray(path)){
      path = [path];
    }
    var key = path.length ? path.unshift() : null;
    var type = source['$_type'];
    if(type){
      if(type === 'object'){
        if(!key) return this.extract(source.members);
        for(var i = 0; i < source.members.length; i++){
          if(source.members[i].key === key){
            return this.extract(source.members[i].value, path);
          }
        }
      }
      else if(type === 'array'){
        if(!key && (key !== 0)) return this.extract(source.items);
        return source.items[key];
      }
      else if('value' in source){
        return source.value;
      }
    }
    return key ? source[key] : source;
  },
  require(dependencies, callback){
    return this.injector.require(dependencies, callback);
  },

});

var core = new Core();
core.core = core;

module.exports = core;

*/