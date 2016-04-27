
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

var tree = new Baobab({});
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
    Router: Router,
    utils: utils,
    symbols: symbols,
    Render: renderer.Render,
    render: renderer.render
  }
));

loader.Module('core.tree', tree);
loader.Module('core.connection', connection);
loader.Component('core.App', ['core.tree', 'core.connection'], App);
// core.components['core.App'] = App;

// core.loadContext(require.context('./dev', true, /.*\.module\.js/));

module.exports = core;
