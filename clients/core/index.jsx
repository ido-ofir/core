
var React = require('react');
var utils = require('./utils');
var Renderer = require('./Renderer');
var Bindings = require('./Bindings.js');
var types = require('./types');
var Core = require('./core-skeleton.js');
var Baobab = require('baobab');

var core = window.core = new Core({
    name: 'client-core',
    plugins: [
      require('./plugins/core.injector'),
      require('./plugins/core.eventEmitter'),
    ],
    extend: {
      components: {},
      views: {},
      templates: {},
      actions: {},
      events: {},
      tree: new Baobab(),
      set(path, value){
        return this.tree.set(path, value);
      },
      get(path){
        return this.tree.get(path);
      },
      select(path){
        return this.tree.select(path);
      },
      theme(path){
        if(!path) return this.get(['config', 'theme']);
        if(this.isString(path)){
          path = path.split(/[\.,\/]/);
        }
        var value = this.get(['config', 'theme'].concat(path));
        return value;
      },
      nativeTypes: {
        undefined(v){ return core.isUndefined(v); },
        null(v){ return core.isNull(v); },
        boolean(v){ return core.isBoolean(v); },
        string(v){ return core.isString(v); },
        number(v){ return core.isNumber(v); },
        array(v){ return core.isArray(v); },
        object(v){ return core.isObject(v); },
        function(v){ return core.isFunction(v); },
        any(v){ return true; }
      },      
      Array: utils.ArrayFind,
      types: types,
      createElement(definition){
        var { type, props, children } = definition;
        var component = this.isString(type) ? this.components[type] : type;
        if(children){
          children = children.map(child => this.createElement(child));
          children.unshift(props);
          children.unshift(component);
          return React.createElement.apply(React, children);
        }
        return React.createElement(component, props);
      },
      createComponent(name, componentDefinition){
        var component;
        if(componentDefinition instanceof Function){ // stateless component function
          component = componentDefinition;
        }
        else{
          componentDefinition = Object.assign({ app: this }, componentDefinition );
          componentDefinition.propTypes = utils.getPropTypes(componentDefinition.propTypes, this.PropTypes);
          componentDefinition.childContextTypes = utils.getPropTypes(componentDefinition.childContextTypes, this.PropTypes);
          component = React.createClass(componentDefinition);
          component.displayName = name;
          if(componentDefinition.enhancers){  // enhancers is an array of higher order constructors.
            componentDefinition.enhancers.map((higherOrder)=>{
              component = higherOrder(component);
            });
          }
        }
        return component;
      },

      build (source) {

          var type, typeName, built;

          if(!source) { return source; }
          typeName = source['$_type'];
          if(!typeName) { return source; }
          type = typeName ? this.types[typeName] : null;
          if(!type) throw new Error(`cannot find type '${typeName}'`);
          if(!type.build) throw new Error(`type '${typeName}' does not have a build method`);
          built = type.build.call(this, source);
          return built;
        },
      
      Type(definition){
        if(!definition || !definition.name) throw new Error('type must have a name');
        if(!definition['$_type']) { definition = Object.assign({ $_type: 'type' }, definition); }
        return this.build(definition);
      },
      Module(definition){
        if(!definition || !definition.name) throw new Error('module must have a name');
        if(!definition['$_type']) { definition = Object.assign({ $_type: 'module' }, definition); }
        return this.build(definition);
      },
      Component(name, dependencies, get){
        if(!name) throw new Error('component must have a name');
        return this.build({
          $_type: 'component',
          name: name,
          dependencies: dependencies,
          get: get
        });
      },
      View(definition, callback){
        if(!definition || !definition.name) throw new Error('view must have a name');
        if(!definition['$_type']) { definition = Object.assign({ $_type: 'view' }, definition); }
        return this.build(definition);
      },
      Template(definition, callback){
        if(!definition || !definition.name) throw new Error('template must have a name');
        if(!definition['$_type']) { definition = Object.assign({ $_type: 'template' }, definition); }
        return this.build(definition);
      },
      Action(definition){
        if(!definition || !definition.name) throw new Error('action must have a name');
        if(!definition['$_type']) { definition = Object.assign({ $_type: 'action' }, definition); }
        return this.build(definition);
      },
      App(definition){
        if(!definition || !definition.name) throw new Error('app must have a name');
        if(!definition['$_type']) { definition = Object.assign({ $_type: 'app' }, definition); }
        return this.build(definition);
      },
      run(name, data, promise){
        // console.log(new Error(name));
        var action = this.actions[name];
        if(!action) throw new Error(`cannot find action '${name}'`);
        if(!data) data = {};
        var defered = promise || utils.Promise();
        utils.validateSchema(action.schema, this.nativeTypes, data, action.name);
        action.run.call(this, data, defered);
        return defered.promise;
      },
      bind(bindings, render){
        var props = {
          bindings: bindings,
          render: render,
          tree: this.tree
        };
        return React.createElement(Bindings, props);
      },
      Bindings: Bindings,
      bequeath(definition, options) {

        // create an object that inherits from this.
        // bind functions on definition to new object.
        // for each key in 'options.inherit', the new object will have
        // a property that inherits from this[key].

        if (!options) options = {};
        var inherit = options.inherit || [];
        var child = Object.create(this);
        for (var m in definition) {
          if (this[m] && inherit.indexOf(m) > -1) { // bequeath properties to child.
            child[m] = Object.create(this[m]);
          } else {
            if (this.isFunction(definition[m])) {
              child[m] = definition[m].bind(child);
            } else {
              child[m] = definition[m];
            }
          }
        }
        return child;
      },
      loadPlugins(plugins){
        plugins.map(plugin => this.Plugin(plugin));
      }
    }
});

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
  this.PropTypes = { ...React.PropTypes };
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