var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');

core.plugin([
    require('./core_plugins/ui')
]);

require('./app/app.js');

core.require('Chords', (Chords) => {
    ReactDom.render(<Chords/>, document.getElementById('app'));
});


