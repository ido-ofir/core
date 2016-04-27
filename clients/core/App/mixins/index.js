var React = require('react');
var PropTypes = React.PropTypes;
var Connection = require('../../modules/connection')
var style = require('./style.js');

module.exports = {
  getInitialState(){
    var config = this.app;
    var connection = window.connection = this.connection = Connection(config);
    return {
      app: {
        connection: connection,
        style: style
      }
    };
  },
  componentDidMount(){
    window.app = this.state.app;
  },
  childContextTypes: {
    app: PropTypes.object
  },
  getChildContext(){
    return {
      app: this.state.app
    };
  }
}
