
var React = require('react');
var Baobab = require('baobab');

module.exports = function (core) {

  function App(definition) {

    var app = this;
    app.name = definition.name;
    app.isLoaded = false;
    app.tree = new Baobab(definition.tree);
    app.modules = {};
    app.components = {};
    app.actions = {};
    app.plugins = {};
    app.types = { ...core.types };
    app.injector = core.Injector((loadedModule, data, dependencies)=>{
      app.modules[data.name] = loadedModule;
    });
    app.loadContext = app.injector.loadContext;
    app.require = app.injector.require;
    app.PropTypes = { ...React.PropTypes };

    for(var m in definition){ // bind all functions to app.
      if(core.isFunction(definition[m])){
        app[m] = definition[m].bind(app);
      }
    }

    if(definition.modules){
      definition.modules.map(m => {
        'value' in m ?
          app.Module(m.name, m.value) :
          app.Module(m.name, m.dependencies || [], m.get)
      });
    }
    if(definition.components){
      definition.components.map(c => app.Component(c.name, c.dependencies || [], c.get))
    }
    if(definition.actions){
      definition.actions.map(action => { this.actions[action.name] = action; })
    }
  }

  App.prototype = core.utils.Emitter({
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
  });

  return App;

}
