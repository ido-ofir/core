var React = require('react');
var PropTypes = React.PropTypes;

var Injector = require('./Injector.js');

window.find = function find(name, obj) {
  if(obj[name]) return obj[name];
  var array = name.split('.');
  var target, path = [];
  if(array.length < 2) return null;
  while(array.length){
    path.push(array.pop())
    name = array.join('.');
    if(obj[name]){
      target = obj[name];
      while(target && path.length){
        name = path.pop();
        if(!path.length){
          return target[name];
        }
        target = target[name];
      }
    }
  }
  return null;
}
module.exports = function Loader(constructors){

  var contexts = {};
  var activeContext;
  var pathToSet = null;

  var injector = Injector((module, data, dependencies)=>{
    // console.log('loaded:');
    // console.dir(data);
  });

  function loadContext(name, contextRequire){
    // console.dir(contextRequire);
    if(!contextRequire){
      contextRequire = name;
      name = 'orphand';
    }
    if(!contexts[name]) contexts[name] = {};
    activeContext = contexts[name];
    contextRequire.keys().map((path)=>{
      // console.log('loading',  name);
      if(path.indexOf('@') > -1) return;
      pathToSet = path;
      injector.setPath(path);
      contextRequire(path)
    });
  }

  var components = {};
  var mixins = {};
  var modules = {};
  var indexes = {};
  var enhancements = {};
  var actions = {};

  function Module(name, module){
    modules[name] = module;
    return module;
  }

  function Mixin(name, mixin){
    if(constructors.mixin) mixin = constructors.mixin(name, mixin);
    mixins[name] = mixin;
    return mixin;
  }

  function Component(name, component){
    if(constructors.component) component = constructors.component(name, component);
    components[name] = component;
    return component;
  }

  function Index(name, index){
    indexes[name] = index;
    return index;
  }

  function Action(name, action){
    if(constructors.action) action = constructors.action(name, action);
    actions[name] = action;
    return action;
  }

  function Enhance(definition) {

  }

  function load(name, dependencies, getDefinition, construct){
    if(activeContext && pathToSet){
      activeContext[name] = pathToSet;
    }
    // if(Array.isArray(dependencies) && getDefinition instanceof Function){ // load async with dependecies
    //   injector.load(name, dependencies, getDefinition, construct);
    // }
    // else if(!getDefinition){  // no dependecies - load sync.
    //   injector.add(name, construct(name, dependencies));  // dependecies is the actual module.
    // }
    if(!getDefinition){
      getDefinition = dependencies;
      dependencies = [];
    }
    if(getDefinition instanceof Function){
      injector.load(name, dependencies, getDefinition, construct)
    }
    else if(typeof getDefinition === 'object'){
      return injector.add(name, construct(name, getDefinition));
    }
    else{
      console.error(`cannot load module definition from ${typeof getDefinition}:`);
      console.debug(getDefinition);
    }
  }

  return {
    components: components,
    mixins: mixins,
    modules: modules,
    indexes: indexes,
    actions: actions,
    getDependencies(name){
      for (var i = 0; i < injector.resolved.length; i++) {
        if(injector.resolved[i].name === name){
          return injector.resolved[i].dependencies;
        }
      }
      return [];
    },
    getDependents(name){
      var item, dependency;
      var dependents = [];
      for (var i = 0; i < injector.resolved.length; i++) {
        item = injector.resolved[i];
        if((item.dependencies.indexOf(name) > -1) && (dependents.indexOf(item.name) === -1)){
          dependents.push(item.name);
        }
      }
      return dependents;
    },
    Component(name, dependencies, getDefinition){
      load(name, dependencies, getDefinition, Component);
    },
    Mixin(name, dependencies, getDefinition){
      load(name, dependencies, getDefinition, Mixin);
    },
    Module(name, dependencies, getDefinition){
      load(name, dependencies, getDefinition, Module);
    },
    Action(name, dependencies, getDefinition){
      load(name, dependencies, getDefinition, Action);
    },
    action(name, data){
      var action = find(name, actions);
      if(!action || !(action instanceof Function)) return console.error(`cannot find action ${name}`);
      // var deffered = q.defer();
        // console.debug("action", name);
      return new Promise(function(resolve, reject) {
        action(data, (err, value)=>{
          if(err) return reject(err);
          resolve(value);
        });
      });
    },
    Enhance(name, definition){  // Enhance('MyConstructors', { Component(){ ... }, Module(){} }
      if(enhancements[name]) return console.error(`there are two enhancements named ${name}`);
      enhancements[name] = Enhance(definition);
    },
    enhance(){

    },
    Index(name, dependencies){
      load(name, dependencies, ()=>{
        var index = {};
        dependencies.map((item, i)=>{ index[item] = arguments[i]; })
        return index;
      }, Index);
    },
    loadContext: loadContext,
    loadContexts(contexts){
      for(var name in contexts){
        loadContext(name, contexts[name])
      }
    },
    getPaths: injector.getPaths,
    getContexts(){
      return { ...contexts };
    },
    add: injector.add,
    require: injector.require
  };
};
