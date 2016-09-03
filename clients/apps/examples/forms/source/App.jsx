var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');
var Baobab = require('baobab');

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));
// core.loadContext('dev-client', require.context('./dev-client', true, /.*\.module\.js/));
core.loadContext('source', require.context('./', true, /.*\.module\.js/));

core.on('error', (err)=>{
  console.error(err && (err.error || err));
});

core.router.on();

var element = document.getElementById('app');
core.require([
  'core.App', 'Forms'], (App, Forms)=>{

    ReactDom.render(
        <App>
          { core.router.render() }
        </App>, element);

})
