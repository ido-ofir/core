var React = require('react');
var PropTypes = React.PropTypes;

var Injector = require('./Injector.js');

module.exports = function Loader(constructors){

  var contexts = {
    orphand: {}
  };
  var activeContext = contexts.orphand;
  var pathToSet = null;

  var injector = Injector((module, data, dependencies)=>{
    // console.log('loaded:');
    // console.dir(data);
  });

  function loadContext(name, contextRequire){

    if(!contextRequire){
      contextRequire = name;
      name = 'orphand';
    }
    if(!contexts[name]) contexts[name] = {};
    activeContext = contexts[name];
    contextRequire.keys().map((path)=>{
      if(path.indexOf('@') > -1) return;
      pathToSet = path;
      injector.setPath(path);
      contextRequire(path)
    });
  }

  var components = {};
  var modules = {};
  var indexes = {};
  var props = {};

  function Module(name, module){
    modules[name] = module;
    return module;
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

  function Prop(name, prop){
    props[name] = prop;
    return prop;
  }

  function load(name, dependencies, getDefinition, construct){
    if(activeContext && pathToSet){
      activeContext[name] = pathToSet;
    }
    if(Array.isArray(dependencies) && getDefinition instanceof Function){ // load async with dependecies
      injector.load(name, dependencies, getDefinition, construct);
    }
    else if(!getDefinition){  // no dependecies - load sync.
      injector.add(name, construct(name, dependencies));  // dependecies is the actual module.
    }
    else{
      console.error(`cannot load module definition from ${typeof getDefinition}:`);
      console.debug(getDefinition);
    }
  }

  return {
    components: components,
    modules: modules,
    indexes: indexes,
    // actions: actions,
    props: props,
    lists: injector.lists,
    getDependencies: injector.getDependencies,
    getDependents: injector.getDependents,
    Component(name, dependencies, getDefinition){
      load(name, dependencies, getDefinition, Component);
    },
    Module(name, dependencies, getDefinition){
      load(name, dependencies, getDefinition, Module);
    },
    Prop(name, dependencies, getDefinition){
      load(name, dependencies, getDefinition, Prop);
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
