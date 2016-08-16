var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));
core.loadContext('source', require.context('./', true, /.*\.module\.js/));

core.on('leftKey', core.router.back)
core.on('rightKey', core.router.forward)

core.router.on();

var element = document.getElementById('app');
core.require([
  'core.App'], (App)=>{

    ReactDom.render(
      <App style={{ padding: 20 }}>
        { core.router.render() }
      </App>, element);

})
