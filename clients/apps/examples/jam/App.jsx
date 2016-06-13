var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');
var Baobab = require('baobab');

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

core.Style('box', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});


core.loadContext(require.context('./', true, /.*\.module\.js/));

var element = document.getElementById('app');
core.require([
  'core.App', 'Jam'], (App, Jam)=>{
  ReactDom.render(
    <App>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Jam/>
      </MuiThemeProvider>

    </App>, element);
})
