
var React = require('react');
var core = require('core');
var ReactDom = require('react-dom');

core.loadContext('index', require.context('./', true, /.*\.module\.js/));

core.require(['Index'], (Index)=>{
  ReactDom.render(<Index/>, document.getElementById('app'));
})
