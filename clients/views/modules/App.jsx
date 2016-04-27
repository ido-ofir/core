var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');
var Baobab = require('baobab');
// var Webint = require('components/webint/Webint');
// var Koko = require('components/Koko');
require('contexts/webint');

core.loadContext(require.context('./parts', true, /.*\.module\.js/));
// core.loadContext(require.context('layout', true, /.*\.module\.js/));
// core.loadContext(require.context('koko', true, /.*\.module\.js/));
// core.loadContext(require.context('webint', true, /.*\.module\.js/));



var config = {
  domain: 'localhost',
  port: 4000
};

var element = document.getElementById('app');
core.require([
  'core.App',
  'Webint',
  'shell.Modules'], (App, Webint, Modules)=>{
  ReactDom.render(
    <App>
        <Modules/>
    </App>, element);
})
// ReactDom.render(core.render({
//   type: 'core.App',
//   children: [{
//     type: 'Shell',
//     props: {
//       config: config
//     },
//     children: [{
//       type: 'Webint',
//       props: {
//         config: config
//       },
//       children: [{
//         type: 'Dashboard'
//       }]
//     }]
//   }]
// }), element);

//
// ReactDom.render(core.render({
//   'core.App': [{
//     'shell.Shell': {
//       config: config,
//       '<>': [{
//         'webint.Webint': {
//           config: config,
//           '<>': [{
//             'Dashboard': {}
//           }]
//         }
//       }]
//     }
//   }]
// }), element);



// ReactDom.render((
//   <App>
//     <Shell config={ config }>
//       <Webint config={ config }>
//
//       </Webint>
//     </Shell>
//   </App>
// ), element);
// core.require(['webint', 'shell.Shell'], (webint, Shell)=>{
//   var App = core.App;
//   var Webint = webint.Webint;
//
// });
