var React = require('react');
var PropTypes = React.PropTypes;

var themeMixin = {
  contextTypes: {
    app: PropTypes.object
  },
  theme(path){
    return this.context.app.theme.get(path);
  },
};

module.exports = themeMixin;
