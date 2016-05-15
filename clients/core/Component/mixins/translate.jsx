var React = require('react');
var format = require("string-template")

var PropTypes = React.PropTypes;

var translateMixin = {
  contextTypes: {
    app: PropTypes.object
  },
  translate(key, context){
    key = `${this.constructor.displayName}.${key}`
    var app = this.context.app;
    if(app){
        var value = app.get(`core.config.language.${key}`);
        if(value){
          return parse(value, context);
        }
    }
  }
};

module.exports = translateMixin;
