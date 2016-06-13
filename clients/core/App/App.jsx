var React = require('react');
var PropTypes = React.PropTypes;
var Baobab = require('baobab');
var Connection = require('../Connection');
// comment
var style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};

var App = function (core) {
  return {
    getInitialState(){
      this.connection = core.connection;
      this.tree = core.tree;
      this.core = core;
      return null;
    },
    componentDidMount(){
      window.app = this;
    },
    childContextTypes: {
      app: PropTypes.object
    },
    getChildContext(){
      return {
        app: this
      };
    },
    set(path, value){
      if(typeof path === 'string'){
        path = path.split('.');
      }
      this.tree.set(path, value);
    },
    get(path){
      if(typeof path === 'string'){
        path = path.split('.');
      }
      return this.tree.get(path);
    },
    render() {
      return (
        <div style={{ ...style, ...this.props.style }} role="app">
          { this.props.children }
        </div>
      );
    }
  }
};

module.exports = App;
