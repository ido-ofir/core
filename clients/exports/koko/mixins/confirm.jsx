var React = require('react');
var PropTypes = React.PropTypes;

var confirmMixin = {
  contextTypes: {
    koko: PropTypes.object
  },
  confirm(){
    this.context.koko.confirm.apply(this.context.koko, arguments);
  }
};

module.exports = confirmMixin;
