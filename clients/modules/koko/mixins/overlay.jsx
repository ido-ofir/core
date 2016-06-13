var React = require('react');
var PropTypes = React.PropTypes;

var overlayMixin = {
  contextTypes: {
    koko: PropTypes.object
  },
  overlay(){
    this.context.koko.overlay.apply(this.context.koko, arguments);
  },
};

module.exports = overlayMixin;
