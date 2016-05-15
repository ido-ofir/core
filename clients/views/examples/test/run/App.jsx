var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');
var Component = require('./component/Run.jsx');
var Koko = require('components/Koko');
var Router = core.Router;
require('contexts/dev');

var config = {
  domain: 'localhost',
  port: 4000
};
var element = document.getElementById('app');
core.require([
  'core.App',
  'Shell'], (App, Shell)=>{
    ReactDom.render(
    <App>
      <Shell config={ config }>
        <Router components={ core.components } defaultRoute="run"/>
      </Shell>
    </App>, element);
})
/*

core.Render({
  'shell.Shell': {
    '>':{
      'A': {
        '>':{
          'B'
        }
      }
    }
  }
});
*/
