var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');
var Baobab = require('baobab');
require('contexts/basic');

core.loadContext(require.context('./parts', true, /.*\.module\.js/));

var element = document.getElementById('app');
core.require([
  'core.App',
  'shell.Shell'
], (App, Shell)=>{
  ReactDom.render(
    <App>
        <Shell/>
    </App>, element);
})
