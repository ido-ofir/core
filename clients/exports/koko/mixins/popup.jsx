var React = require('react');
var PropTypes = React.PropTypes;

var overlayMixin = {
  contextTypes: {
    koko: PropTypes.object
  },
  popup(){
    this.context.koko.popup.apply(this.context.koko, arguments);
  },
};

module.exports = overlayMixin;
