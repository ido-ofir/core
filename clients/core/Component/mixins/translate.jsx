var React = require('react');
var PropTypes = React.PropTypes;

var translateMixin = {
  contextTypes: {
    app: PropTypes.object
  },
  translate(key, dafaultValue, args){
    // if(!ignoreNS){
      key = `${this.constructor.displayName}.${key}`
    // }
    return this.context.app.language.get(key, dafaultValue, args);
  }
};

module.exports = translateMixin;
