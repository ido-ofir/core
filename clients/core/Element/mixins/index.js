var React = require('react');
var PropTypes = React.PropTypes;

var styleMixin = require('./style.js');

module.exports = {
  mixins: [styleMixin],
  contextTypes: {
    app: PropTypes.object,
    components: PropTypes.object,
  }
};
