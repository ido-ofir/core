
var React = require('react');
var Baobab = require('baobab');
var ReactTestUtils = window.ReactTestUtils = require('react-addons-test-utils');

window.react = React;

var utils = require('./utils');
var App = require('./App');
var Component = require('./Component');
var Element = require('./Element');
var Loader = require('./Loader');
var Renderer = require('./Renderer');
var Connection = require('./Connection');
var Router = require('./Router');
var defaultTheme = require('./App/defaultTheme.js');

var tree = new Baobab({
  core: {
    config: {
      theme: defaultTheme,
      language: { key: 'en' }
    }
  }
});
var connection = Connection();

var symbols = {
  children: '<>'
};

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
    symbols: symbols,
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
    Style(name, style){
      this.styles[name] = style;
    },
    createElement(owner, type, props, ...children){  // parse directives on props relative to the owner.
      var value, result = props;
      var element = {
        owner: owner,
        type: type,
        props: props,
        children: children
      }
      var args = [].slice.call(arguments, 1);
      if(props){
        for(var name in props){  // loop original props
          if(name in result){    // but do something only if the prop was not removed by some directive
            if(core.directives[name]){   // if this prop is a directive

              // run the appropriate directive.

              var value = result[name];
              result = core.directives[name](value, result, element);

              // if a directive returns null, rendering is canceled.
              if(result === null) return null;

              // if a directive returns an array, it is treated as an array of elements to render.
              else if(Array.isArray(result)){
                return result;
              }
            }
            else{  // not a directive, just a normal prop.
              if(result !== props) result[name] = props[name];
            }
          }
        }
      }
      return React.createElement(type, result, ...children);
    },
    $createElement(owner, type, props, ...children){
      var next, clone = props;
      var args = [].slice.call(arguments, 1);
      if(props){
        clone = {};
        for(var name in props){
            if(core.directives[name]){
              next = core.directives[name]({
                owner: owner,
                type: type,
                value: props[name],
                fromProps: props,
                toProps: clone,
                children: children
              });
              if(next === null) return null;
            }
            else{
              if(clone[name]){
                if(typeof clone[name] === 'object' && typeof props[name] === 'object'){
                  clone[name] = utils.merge(clone[name], props[name]);
                }
                else{
                  clone[name] = props[name];
                }
              }
              else{
                clone[name] = props[name];
              }
            }
        }
      }
      return React.createElement(type, clone, ...children);
    },
  }
));

core.Module('core', core);
core.Module('core.tree', tree);
core.Module('core.connection', connection);
core.Component('core.App', ['core', 'core'], App);
// core.components['core.App'] = App;

// core.loadContext(require.context('./dev', true, /.*\.module\.js/));

module.exports = core;
