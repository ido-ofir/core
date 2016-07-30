
var React = require('react');
var Baobab = require('baobab');
var pt = React.PropTypes;

var utils = require('./utils');
var App = require('./App');
var Component = require('./Component');
var Element = require('./Element');
var Injector = require('./Injector');
var Renderer = require('./Renderer');
var Connection = require('./Connection');
var Router = require('./Router');
var Socket = require('./Socket');
var Form = require('./Form');
var Collection = require('./Collection');
var validations = require('./Form/validations.js');
var defaultTheme = require('./theme/defaultTheme.js');
var format = require("string-template");

var injector = Injector((loadedModule, data, dependencies)=>{
  // console.log('loaded:');
  // console.dir(data);
});

var coreObject = window.__coreObject || {}
var currentSource = { core: {} };


var tree = new Baobab({
  ...coreObject,
  core: {
    source: currentSource,   // source is initialy empty. updating the source builds the rest of the core object.
    styles: [],
    forms: [],
    collections: [],
    mirrors: [],
    language: {},
    theme: defaultTheme,
    router: {
      home: 'a/b/c',
      route: {},
      query: {},
      map: null
    }
  }
});


tree.select(['core', 'source']).on('update', (e)=>{                          // listen for synced writes to the tree.
  // var path = e.data.path;
  // if(path[0] !== 'core') return;                 // but do something only if 'core.source' has been chaged.
  // if(path[1] !== 'source') return;
  var source = tree.get(['core', 'source']);
  var { forms, collections, theme, config } = source.core;
  var { currentConfig, currentForms, currentCollections, currentTheme } = currentSource.core;
  /* forms */
  if(forms !== currentSource.core.forms){
    // tree.set(['core', 'source', 'forms'], {});
    // console.debug("setting forms", source.forms);
    source.core.forms.map((form)=>{
      core.Form(form.name, form);
    });
  }
  /* collection */
  if(collections !== currentSource.core.collections){
    // tree.set(['core', 'source', 'forms'], {});
    // console.debug("setting forms", source.forms);
    source.core.collections.map((collection)=>{
      core.Collection(collection.name, collection);
    });
  }
  /* theme */
  if(theme !== currentSource.core.theme){
    // tree.set(['core', 'source', 'forms'], {});
    // console.debug("setting theme", source.theme);
    core.tree.set(['core', 'theme'], theme);
  }

});

tree.select(['core', 'source', 'core', 'config', 'dev', 'ws']).on('update', (e)=>{
  var ws = tree.get(['core', 'source', 'core', 'config', 'dev', 'ws']);
  if(core.devSocket){
    core.devSocket.off();
    core.devSocket.close();
  }
  if(ws) {
    core.devSocket = core.Socket({
      url: ws,
      onOpen(socket){
        socket.run('registerClient', { appPath: location.pathname }).then(() => { core.emit('registerClient') });
        socket.on('set', (data)=>{
          core.tree.set(['core', 'source'].concat(data.path), data.value);
        });
        console.log('started');
      }
    });
  }
  else{
    if(core.devSocket){
      core.devSocket.off();
      core.devSocket.close();
    }

  }
});

var connection = Connection();



var core = window.core = utils.Emitter({
    devSocket: null,
    App: App,
    Element: Element,
    Connection: Connection,
    connection: connection,
    Router: Router,
    tree: tree,
    utils: utils,
    set(path, value){
      if(typeof path === 'string'){
        path = path.split('.');
      }
      path.unshift('core');
      return tree.set(path, value);
    },
    get(path){
      if(typeof path === 'string'){
        path = path.split('.');
      }
      path.unshift('core');
      return tree.get(path, value);
    },
    styles: {},
    props: {},
    actions: {},
    components: {},
    mirrors: [],
    validations: validations,
    types: {
      undefined(v){ return core.isUndefined(v); },
      null(v){ return core.isNull(v); },
      boolean(v){ return core.isBoolean(v); },
      string(v){ return core.isString(v); },
      number(v){ return core.isNumber(v); },
      array(v){ return core.isArray(v); },
      object(v){ return core.isObject(v); },
      function(v){ return core.isFunction(v); }
    },
    typeOf(thing){
      for(var type in this.types){
        // console.log('type', type, thing, this.types[type], this.types[type](thing));
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
    Style(name, style){
      if(this.styles[name]){
        console.warn(`style ${name} was defined twice, overriding..`)
      }
      this.styles[name] = style;
    },
    Prop(name, prop){
      if(this.props[name]){
        console.warn(`prop ${name} was defined twice, overriding..`)
      }
      this.props[name] = prop;
    },
    error(err){
      core.emit('error', err);
    },

    bind(bindings, render){ // provides a higher order for binding to any point on the tree
      return <Bindings bindings={ bindings } render={ render }/>
    },

    form(formName, render){     // provides a higher order for binding to a form
      var path = ['core', 'forms', { name: formName }];
      return <Bindings bindings={ path } render={ render }/>
    },

    input(inputName, formName, render){ // provides a higher order for binding to a form input
      var path = ['core', 'forms', { name: formName }, 'inputs', inputName];
      return <Bindings bindings={ path } render={ render }/>
    },

    watch(path, callback){
      var watcher = core.tree.watch({ item: path });
      var isOn = true;
      function update() {
        callback(watcher.get().item);
      }
      watcher.on('update', update);
      return {
        on() { watcher.on('update', update); },
        off(){ watcher.off('update', update); }
      };
    },

    Mirror({ localPath, remotePath, url, key }){
      var isRemoteUpdating = false;
      var changes = [];
      var localCursor = core.tree.select(localPath);
      var socket = core.Socket({
        url: url,
        actions: {
          set(path, value){
            isRemoteUpdating = true;
            core.tree.set(localPath.concat(path), value);
          }
        }
      });
      function update(e) {
        if(isRemoteUpdating){
          isRemoteUpdating = false;
          return;
        }
        socket.run('update', )
      }
      function write() {

      }
      core.tree.on('write', write);
      localCursor.on('update', update);
    },

    Module(name, dependencies, method){
      injector.load(name, dependencies, method);
    },
    Component(name, dependencies, method){
      var definition;
      if(!method){
        definition = dependencies;
        dependencies = [];
      }
      return injector.load(name, dependencies, (...modules) => {
        if(method){
          definition = method(...modules);
        }
        var component = Component(name, definition);
        this.components[name] = component;
        return component;
      });
    },
    Input(name, dependencies, construct){

      var definition;
      if(!construct){
        definition = dependencies;
        dependencies = [];
      }
      core.Component(name, dependencies, (...dep)=>{

        if(construct){
          definition = construct(...dep);
        }
        var ComposedComponent = Component(name, definition);

        return {
          propTypes: {
            form: pt.string,
            name: pt.string
          },
          contextTypes: {
            form: pt.string
          },
          getInitialState(){
            var formName = this.props.form || this.context.form;
            var inputName = this.props.name;
            return this.watch({
              input: ['core', 'forms', { name: formName }, 'inputs', inputName]
            });
          },
          shouldComponentUpdate(nextProps, nextState){
            return (nextState.input !== this.state.input);
          },
          render(){
            return (
              <ComposedComponent { ...this.props } input={ this.state.input }/>
            );
          }
        };
      });
    },
    Action(name, schema, action){
      if(!action && schema instanceof Function){  // allow schemaless actions
        action = schema;
        schema = {};
      }
      action.schema = schema;
      this.actions[name] = action;
    },
    run(name, data){
        var i, defered, type, types, index, required, valid, param, validated, passed;
        var action = this.actions[name];
        if(!data) data = {};
        defered = utils.Promise();
        defered.promise.catch((err)=>{
          this.error({ type: 'core.run', error: err });
        });  // emit 'error' event if failed.
        function reject(msg) {
          defered.reject(msg);
          return defered.promise;
        }

        if(!action) return reject(`cannot find action '${name}'`);
        for(param in action.schema){  // validate required params and param types.
          type = action.schema[param];
          // if(core.isObject(type))
          index = type.indexOf('!');  // a required param has an '!' at the end.
          required = index > -1;
          if(required){  // if it's required and missing - fail.
            if(!(param in data)){
              return reject(`required param '${param}' is missing in action '${name}'`);
            }
            type = type.substr(0, index);  // remove the '!'
            if(!type || (type === 'any')) continue;   // if was '!' or 'any!' skit the type validation.
          }
          index = type.indexOf('~');  // multiple types.
          if(index > -1){
            types = type.split('~').map(t => t.trim());
            passed = false;
            for (i = 0; i < types.length; i++) {
              type = types[i];
              if(!this.types[type]){
                return reject(`unknown type '${type}' in action '${name}'`);
              }
              if(param in data){  // validate the type of param.
                valid = this.types[type](data[param]);
                if(valid){
                  passed = true;
                  break;
                }
              }
            }
            if(!passed){
              return reject(`parameter '${param}' in action '${name}' is of type '${ this.typeOf(data[param]) }'. it should be one of ${types}.`);
            }
          }
          else{
            if(!this.types[type]){
              return reject(`unknown type '${type}' in action '${name}'`);
            }
            if(param in data){  // validate the type of param.
              valid = this.types[type](data[param]);
              if(!valid){
                return reject(`parameter '${param}' in action '${name}' is of type '${ this.typeOf(data[param]) }'. it should be of type '${type}'.`);
              }
            }
          }
        }
        action(data, defered);
        return defered.promise;
    },
    createElement(type, props, ...children){  // look for global props.
      var value, result = props;
      var element = {
        type: type,
        props: props,
        children: children
      }
      var args = [].slice.call(arguments, 1);
      if(props){
        for(var name in props){  // loop original props
          if(name in result){    // but do something only if the prop was not removed by some other global prop
            if(core.props[name]){   // if this prop is global

              // run the appropriate prop.

              var value = result[name];
              result = core.props[name](value, result, element);

              // if a prop returns null, rendering is canceled.
              if(result === null) return null;

              // if a prop returns an array, it is treated as an array of elements to render.
              else if(Array.isArray(result)){
                return result;
              }
            }
            else{  // not a global prop.
              if(result !== props) result[name] = props[name];
            }
          }
        }
      }
      // return the rendered element.
      return React.createElement(type, result, ...children);
    },
    translate(key, context){
      var cursor = tree.select(['core', 'config', 'language', key]);
      if(!cursor.exists()) return core.error({
        type: 'core.translate',
        error: `cannot find key ${key}`
      });
      var string = cursor.get();
      return format(string, context);
    },
    theme(path){
      if(core.isString(path)){
        path = path.split('.');
      }
      path.unshift('core', 'theme')
      return core.tree.get(path);
    },
    language(lang){
      if(lang) {
        return tree.set(['core', 'source', 'language'], lang);
      }
      return tree.get(['core', 'source', 'language']);
    },
    pallete(name){
      return tree.get(['core', 'theme', 'palletes', { name: name }, "pallete"])
    },
    loadContext: injector.loadContext,
    require: injector.require
});

core.Form = Form(core);
core.Collection = Collection(core);
core.router = Router(core);
core.renderer = Renderer(core);
core.Socket = Socket(core);
core.render = core.renderer.render;

// core.router.on();

core.Module('core', core);
core.Module('core.tree', tree);
core.Module('core.connection', connection);
core.Component('core.App', ['core'], App);

var Bindings = core.Component('core.Bindings', {
  propTypes: {
    bindings: pt.oneOfType([pt.object, pt.string, pt.array]).isRequired,
    render: pt.func
  },
  getInitialState(){
    var bindings = this.props.bindings;
    if(core.isString(bindings)){
      this.isSingle = true;
      bindings = { item: bindings.split('.') }
    }
    else if(core.isArray(bindings)){
      this.isSingle = true;
      bindings = { item: bindings }
    }
    return this.watch(bindings);
  },
  render(){
    var data = this.isSingle ? this.state.item : this.state;
    var render = this.props.render || this.props.children;
    return render(data);
  }
});

core.Prop('if', (value, props, element)=>{
  if(!value) return null;
  return props;
});

core.Prop('styles', (value, props, element)=>{
  var m, newStyle = {};
  value.split(' ').map((name)=>{
    var coreStyle = core.styles[name];
    if(!coreStyle) return console.error(`core styles directive cannot find style ${name}`);
    for(var rule in coreStyle){
      newStyle[rule] = coreStyle[rule];
    }
  });
  var newProps ={};
  for(m in props){
    if(m !== 'style' && m !== 'styles') newProps[m] = props[m];
  }
  if(props.style){
    for(m in props.style){
      newStyle[m] = props.style[m];
    }
  }
  newProps.style = newStyle;
  return newProps;

});

core.Style('box', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});

core.Style('flex', { display: 'flex' });
core.Style('center', { display: 'flex', alignItems: 'center', justifyContent: 'center' });
core.Style('spread', { display: 'flex', justifyContent: 'space-between' });

core.tree.set(['core', 'source'], coreObject);

module.exports = core;
