var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');

var app = require('./app/app.js');

ReactDom.render(<app.Root/>, document.getElementById('app'));
