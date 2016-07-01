var React = require('react');
var PropTypes = React.PropTypes;

var notifyMixin = {
  contextTypes: {
    koko: PropTypes.object
  },
  notify(){
    this.context.koko.notify.apply(this.context.koko, arguments);
  },
};

module.exports = notifyMixin;
