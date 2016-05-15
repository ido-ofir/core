var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');
var Baobab = require('baobab');
require('contexts/basic');

core.loadContext(require.context('./modules', true, /.*\.module\.js/));

var element = document.getElementById('app');
core.require([
  'core.App',
  'Modules'], (App, Modules)=>{
  ReactDom.render(
    <App>
        <Modules/>
    </App>, element);
});
