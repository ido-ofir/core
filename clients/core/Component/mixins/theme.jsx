var React = require('react');
var PropTypes = React.PropTypes;

var themeMixin = {
  contextTypes: {
    app: PropTypes.object
  },
  theme(path){
    var app = this.context.app;
    if(app){
        return app.get(`core.config.theme.${path}`)
    }
  }
};

module.exports = themeMixin;
