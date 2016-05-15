var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');

require('contexts/basic');

core.loadContext(require.context('./', true, /.*\.module\.js/));

var config = {
  domain: 'localhost',
  port: 4000
};

var element = document.getElementById('app');


core.require([
  'core.App',
  'Mongo'], (App, Mongo)=>{

  function render() {
    ReactDom.render(
      <App>
        <Mongo/>
      </App>, element);
  }


  render();
})
