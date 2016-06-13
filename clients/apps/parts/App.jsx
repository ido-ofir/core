var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');
var Baobab = require('baobab');
require('contexts/basic');

core.loadContext(require.context('./parts', true, /.*\.module\.js/));

var element = document.getElementById('app');
core.require([
  'core.App',
  'Parts'], (App, Parts)=>{
  ReactDom.render(
    <App>
        <Parts/>
    </App>, element);
})
