
var React = require('react');
var Baobab = require('baobab');

var utils = require('./utils');
var App = require('./App');
var Component = require('./Component');
var Element = require('./Element');
var Loader = require('./Loader');
var Renderer = require('./Renderer');
var Connection = require('./Connection');
var Router = require('./Router');
var Form = require('./Form');
var validations = require('./Form/validations.js');
var defaultTheme = require('./App/defaultTheme.js');
var format = require("string-template");

var tree = new Baobab({
  core: {
    config: {
      theme: defaultTheme,
      language: { key: 'en' }
    },
    forms: {}
  }
});
var connection = Connection();

var loader = Loader({
  component: Component,
  mixin: Component.Mixin
});

var renderer = Renderer(loader.components);

var core = window.core = utils.Emitter(utils.merge(
  loader,
  {
    App: App,
    Element: Element,
    Connection: Connection,
    connection: connection,
    Router: Router,
    tree: tree,
    utils: utils,
    Render: renderer.Render,
    render: renderer.render,
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
    actions: {},
    validations: validations,
    types: {
      undefined(v){ return v === undefined; },
      null(v){ return v === null; },
      boolean(v){ return typeof v === 'boolean'; },
      string(v){ return typeof v === 'string'; },
      number(v){ return typeof v === 'number'; },
      array(v){ return v instanceof Array; },
      object(v){ return (v instanceof Object && !(v instanceof Array)); }
    },
    typeOf(thing){
      for(var type in this.types){
        // console.log('type', type, thing, this.types[type], this.types[type](thing));
        if(this.types[type](thing)) return type;
      }
    },
    Style(name, style){
      this.styles[name] = style;
    },
    error(err){
      core.emit('error', err);
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
        var defered, type, index, required, valid;
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
        for(var param in action.schema){  // validate required params and param types.
          type = action.schema[param];
          index = type.indexOf('!');  // a required param has an '!' at the end.
          required = index > -1;
          if(required){  // if it's required and missing - fail.
            if(!(param in data)){
              return reject(`required param '${param}' is missing in action '${name}'`);
            }
            type = type.substr(0, index);  // remove the '!'
            if(!type || (type === 'any')) continue;   // if was '!' or 'any!' skit the type validation.
          }
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
    }
  }
));
window.format = format;
core.Form = Form(core);

core.Module('core', core);
core.Module('core.tree', tree);
core.Module('core.connection', connection);
core.Component('core.App', ['core', 'core'], App);


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

// core.Prop('bind', (value, props, element)=>{
//   var { form, input } = value;
// });
// core.components['core.App'] = App;

// core.loadContext(require.context('./dev', true, /.*\.module\.js/));

module.exports = core;
