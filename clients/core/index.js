
var React = require('react');
var utils = require('./utils');
var Injector = require('./Injector');
var Renderer = require('./Renderer');
var Bindings = require('./Bindings.js');
var App, AppFunction = require('./App');

function Core() {

  var injector = Injector();
  this.injector = injector;
  this.modules = injector.modules;
  this.components = {};
  this.views = {};
  this.templates = {};
  this.actions = {};
  this.apps = {};
  this.events = {};
  this.plugins = {};
  this.require = injector.require;
  this.loadContext = injector.loadContext;
  this.utils = utils;
  this.PropTypes = { ...React.PropTypes };

}


Core.prototype = utils.Emitter({
  Array: utils.ArrayFind,
  App(def){
    var apps = core.apps;
    var name = def.name;
    if(!name){ throw new Error('an app must have a name'); }
    if(apps[name]){
      apps[name].update(def);
      return apps[name];
    }
    var app = new App(def);
    apps[name] = app;
    if(app.init){ app.init(app); }
    return app;
  },
  Injector: Injector,
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
  typeOf(thing){
    for(var type in this.nativeTypes){
      if(this.nativeTypes[type](thing)) return type;
    }
  },
  isUndefined(v){ return v === undefined; },
  isNull(v){ return v === null; },
  isBoolean(v){ return typeof v === 'boolean'; },
  isString(v){ return typeof v === 'string'; },
  isNumber(v){ return typeof v === 'number'; },
  isArray(v){ return Array.isArray(v); },
  isObject(v){ return (v && (typeof v === 'object') && !(Array.isArray(v))); },
  isFunction(v){ return typeof v === 'function'; },
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
  types: {
    boolean: {
      set(def){
        return (def && ('value' in def)) ? Boolean(def.value) : Boolean(def);
      }
    },
    string: {
      set(def){
        return (def && ('value' in def)) ? String(def.value) : String(def);
      }
    },
    number: {
      set(def){
        return (def && ('value' in def)) ? Number(def.value) : Number(def);
      }
    },
    array: {
      set(def){
        var items = core.isArray(def) ? def : ((def && def.items) || []);
        var array = items.map(t => this.build(t));
        return this.Array(array);
      }
    },
    object: {
      schema: {
        members: {
          $_type: 'array',
          ofType: 'keyValue'
        }
      },
      set(def){
        var object = {};
        var members = def.members;
        for (var i = 0; i < members.length; i++) {
          object[members[i].key] = this.build(members[i].value);
        }
        return object;
      }
    },
    type: {
      name: 'type',
      schema: {
        name: {
          $_type: 'string',
          isRequired: true
        },
        schema: {
          $_type: 'schema'
        }
      },
      create(type){
        return this.Type(type);
      }
    },
    schema: {
      set(schema){
        // TODO: validate schema
        return schema;
      }
    },
    code: {
      schema: {
        key: {
          $_type: 'compiled',
          isRequired: true
        },
        value: {
          $_type: 'any'
        }
      },
      set(target){
        var compiled = target.compiled;
        if(!compiled) throw new Error(`cannot find compiled code`);
        var build = eval(compiled);
        return build;
      }
    },
    keyValue: {
      schema: {
        key: {
          $_type: 'string',
          isRequired: true
        },
        value: {
          $_type: 'any'
        }
      },
    }
  },
  Type(definition){
    if(this.types[definition.name] === definition) return;
  },
  builders: {
    boolean(definition){ return definition.value; },
    number(definition){ return definition.value; },
    string(definition){ return definition.value; },
    array(definition){
      var array = definition.items.map(t => this.build(t));
      return this.Array(array);
    },
    object(definition){
      var object = {};
      var members = definition.members;
      for (var i = 0; i < members.length; i++) {
        object[members[i].name] = this.build(members[i])
      }
      for(var key in definition.members){

      }
      return object;
    },
    module(definition){ return this.Module(definition) },
    component(definition){ return this.Component(definition) },
    view(definition){ return this.View(definition) },
    template(definition){ return this.Template(definition) },
    plugin(definition){ return this.Plugin(definition) },
    action(definition){ return this.Action(definition) },
    code(target){
      var compiled = target.compiled;
      if(!compiled) throw new Error(`cannot find compiled code`);
      var build = eval(compiled);
      return build;
    },
  },
  build (target, path) {
    if(!target) return target;
    var type, typeName = target['$_type'];
    var child, newTarget = target;
    if(path){

    }
    if(!path) path = [];
    if(!typeName){  // not a typed entity. build the children recursivly.
      if(this.isObject(target)){
        newTarget = {};
        for(var m in target){
          child = this.build(target[m], (path && path.concat([m])));
          newTarget[m] = child;
        }
      }
      else if(this.isArray(target)){
        newTarget = [];
        for (var i = 0; i < target.length; i++) {
          child = this.build(target[i], (path && path.concat([i])));
          newTarget.push(child);
        }
      }
    }
    else{  // a typed entity, build by type.
      type = this.types[typeName];
      if(!type) throw new Error(`cannot find type ${typeName}`);
      if(type.set){
        newTarget = type.set.call(this, target, path);
      }
      else if(type.create){
        newTarget = type.create.call(this, target, path);
      }
      // if(!this.builders[name]) throw new Error(`cannot find builder ${name}`);
      // newTarget = this.builders[name].call(this, target);
    }
    return newTarget;
    // return Function.apply(args.concat(context)).call(context);
  },
  require(dependencies, callback){
    if(!this.isArray(dependencies)) dependencies = [dependencies];
    if(this.parent){
      dependencies = dependencies.map(name => `${this.name}.${name}`);
      return this.parent.require(dependencies, callback);
    }
    return this.injector.require(dependencies, callback);
  },
  isDefined(definition){  // for hot reloading
    var name = definition.name;
    if(this.definitions[name] === definition) return true;
    this.definitions[name] = definition;
  },
  Builder(definition){
    if(this.isDefined(definition)) return;
  },
  Module(definition){
    var { name, dependencies, get, value } = definition;
    if(this.isDefined(definition)) return;
    if('value' in definition){
      this.injector.load(name, value);
    }
    else{
      this.injector.load(name, dependencies, get.bind(this));
    }
  },
  createComponent(name, componentDefinition){
    var component;
    if(componentDefinition instanceof Function){ // stateless component function
      component = componentDefinition;
    }
    else{
      componentDefinition = { ...componentDefinition, app: this };
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
  Component(definition, callback){
    var { name, dependencies, get, value } = definition;
    if(this.isDefined(definition)) return;
    var hasValue = ('value' in definition);
    var componentDefinition;
    if(hasValue){
      componentDefinition = value;
      dependencies = [];
    }
    if(!dependencies) dependencies = [];
    if(!core.isArray(dependencies)) dependencies = [dependencies];
    return this.injector.load(name, dependencies, (...modules) => {
      if( !hasValue ){
        componentDefinition = get.apply(this, modules);
      }
      var component = this.createComponent(name, componentDefinition);
      this.components[name] = component;
      if(callback) callback(component);
      return component;
    });
  },
  View(definition, callback){
    var { name, bindings, dependencies, template, get } = definition;
    if(this.isDefined(definition)) return;
    if(!dependencies) dependencies = [];
    if(!bindings) bindings = {};
    return this.Component({
      name: name,
      dependencies: dependencies,
      get(...modules){

        var Component = this.createComponent(name, get.call(this, ...modules));
        // var render = get.call(this, ...modules)
        return {
          render(){

            return this.app.bind(bindings, (state)=>{

              var props = { ...this.props, ...state }
              return <Component { ...props }>{ props.children }</Component>
              return render.call(this, state);
            });
          }
        };
      }
    }, (view)=>{
      this.views[name] = view;
      if(callback) callback(view);
    });
  },
  createElement(definition){
    var { type, props, children } = definition;
    var component = this.components[type];
    if(children){
      children = children.map(child => this.createElement(child));
      return React.createElement(component, props, ...children);
    }
    return React.createElement(component, props);
  },
  Template(definition, callback){
    if(this.isDefined(definition)) return;
    var { name, dependencies, get, schema } = definition;
    if(!dependencies) dependencies = [];
    return this.injector.load(name, dependencies, (...modules) => {

      var body = get.apply(this, modules);

      var component = this.createComponent(name, {
        render(){
          return this.app.createElement(body);
        }
      });
      this.components[name] = component;
      if(callback) callback(component);
      return component;
    });
  },
  Plugin(definition){
    if(this.isDefined(definition)) return;
    var newDefinition = this.build(definition);
    var { name, dependencies, get, value } = newDefinition;
    if('value' in newDefinition){
      this.plugins[name] = this.injector.load(name, value);
    }
    else{
      this.injector.load(name, dependencies, get.bind(this), (plugin)=>{
        this.plugins[name] = plugin;
      });
    }
  },
  Action(definition){
    if(this.isDefined(definition)) return;
    var newDefinition = this.build(definition);
    var { name, schema, run, get, dependencies } = newDefinition;
    var app = this;
    function done(run) {
      app.actions[name] = {
        name: name,
        schema: schema,
        run: run,
        dependencies: dependencies
      };
    }
    if(get){
      if(!dependencies || !dependencies.length){
        done(get.call(this));
      }
      else{
        this.require(dependencies, (...modules)=>{
          done(get.apply(this, modules));
        })
      }
    }
    else{
      done(run);
    }
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
    return <Bindings bindings={ bindings } render={ render } tree={ this.tree }/>
  },
  Bindings: Bindings
});

var core = new Core();

App = AppFunction(core);

var structure = {
  $_type: 'object',
  members: [{
    key: 'name',
    value: {
      $_type: 'string',
      value: 'app'
    }
  }, {
    key: 'tree',
    value: {
      $_type: 'object',
      value: {}
    }
  }]
};

// core.structure = App.structure;

module.exports = core;
