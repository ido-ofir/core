
var React = require('react');
var utils = require('./utils');
var Injector = require('./Injector');
var Renderer = require('./Renderer');
var Bindings = require('./Bindings.jsx');
var App, AppFunction = require('./App');
var Baobab = require('baobab');

var Emitter = utils.Emitter;

function Core(name, tree) {

  this.name = name;
  this.events = {};
  this.apps = {};
  this.tree = new Baobab(tree);
  this.injector = Injector();

}

Core.prototype = {
    App(def){
      if(!def.name){ throw new Error('an app must have a name'); }
      var app = new App(def);
      var dependencies = def.dependencies || [];
      this.apps[name] = app;
      return this.injector.load(def.name, dependencies, (...modules) => {
        if(app.init){ app.init(...modules); }
        return app;
      });
      return app;
    },
    require(...args){
      return this.injector.require(...args);
    },
    utils: utils,
    Injector: Injector,
    types: {
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
      for(var type in this.types){
        if(this.types[type](thing)) return type;
      }
    },
    isUndefined(v){ return v === undefined; },
    isNull(v){ return v === null; },
    isBoolean(v){ return typeof v === 'boolean'; },
    isString(v){ return typeof v === 'string'; },
    isNumber(v){ return typeof v === 'number'; },
    isArray(v){ return Array.isArray(v); },
    isObject(v){ return (v instanceof Object && !(Array.isArray(v))); },
    isFunction(v){ return typeof v === 'function'; },
    emptyObject: {},
    emptyArray: [],
    emptyFunction(){},
    createElement(type, props, ...children){  // look for global props.
      // return the rendered element.
      return React.createElement(type, props, ...children);
    },
    Bindings: Bindings,
    on: Emitter.prototype.on,
    off: Emitter.prototype.off,
    emit: Emitter.prototype.emit,
    set(path, value){
      return this.tree.set(path, value);
    },
    get(path){
      return this.tree.get(path);
    },
    Module(name, dependencies, method){
      this.injector.load(name, dependencies, method);
    },
    Component(name, dependencies, method){
      var component, definition;
      if(!method){
        definition = dependencies;
        dependencies = [];
      }
      return this.injector.load(name, dependencies, (...modules) => {
        if(method){
          definition = method.apply(this, modules);
        }
        if(definition instanceof Function){ // stateless component function
          component = definition;
        }
        else{
          definition = { ...definition };
          definition.propTypes = core.utils.getPropTypes(definition.propTypes, this.PropTypes);
          definition.childContextTypes = core.utils.getPropTypes(definition.childContextTypes, this.PropTypes);
          component.displayName = name;
          if(definition.enhancers){  // enhancers is an array of higher order constructors.
            definition.enhancers.map((higherOrder)=>{
              component = higherOrder(component);
            });
          }
        }

        this.components[name] = component;
        return component;
      });
    },
    Action(name, schema, run){
      if(!run && schema instanceof Function){  // allow schemaless actions
        run = schema;
        schema = {};
      }
      this.actions[name] = {
        name: name,
        schema: schema,
        run: run
      };
    },
    run(name, data){
      var action = this.actions[name];
      if(!action) throw new Error(`cannot find action '${name}'`);
      if(!data) data = {};
      var defered = core.utils.Promise();
      core.utils.validateSchema(action.schema, this.types, data, action.name);
      action.run.call(this, data, defered);
      return defered.promise;
    },
    typeOf(thing){
      for(var type in this.types){
        if(this.types[type](thing)) return type;
      }
    },
    bind(bindings, render){
      return <core.Bindings bindings={ bindings } render={ render } tree={ this.tree }/>
    },
    view(name){

    },
    View({ name, bindings, template }){

    }
};

var core = new Core('core', {});

App = AppFunction(core);

module.exports = core;
