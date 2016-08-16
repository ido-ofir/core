var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));
core.loadContext('source', require.context('./', true, /.*\.module\.js/));

var element = document.getElementById('app');
core.require([
  'core.App'], (App)=>{

    ReactDom.render(
      <App style={{ padding: 20 }}>
        <h1>app</h1>
      </App>, element);

})
