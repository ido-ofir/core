var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');
var Baobab = require('baobab');

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));
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
