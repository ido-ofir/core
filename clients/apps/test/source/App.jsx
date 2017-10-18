var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');

core.plugin([
    require('./core_plugins/ui'),
    require('./core_plugins/asset')
]);

require('./app/app.js');

core.require('Test', (Test) => {
    ReactDom.render(<Test/>, document.getElementById('app'));
});


