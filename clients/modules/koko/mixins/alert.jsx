var React = require('react');
var PropTypes = React.PropTypes;

var alertMixin = {
  contextTypes: {
    koko: PropTypes.object
  },
  alert(){
    this.context.koko.alert.apply(this.context.koko, arguments);
  },
};

module.exports = alertMixin;
