var React = require('react');
var PropTypes = React.PropTypes;
var Baobab = require('baobab');
var baobabReact = require('baobab-react');
var Connection = require('../Connection');
var defaultTheme = require('./defaultTheme.js');

var { parseAsFunction, parseObjectToContext } = require('./pure.js');
// comment
var style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};

function find(target, array){
  if(!array.length) return target;
  if(!target) return null;
  var field = array.shift();
  return find(target[field], array);
}
function set(target, array, value){
  if(!target) return null;
  var field = array.shift();
  if(!array.length) {
    target[field] = value;
    return true;
  }
  return set(target[field], array, value);
}



var Root = React.createClass({
  mixins: [baobabReact.mixins.root],
  render() {
    return (
      <div style={ { ...style } }>
        { this.props.children }
      </div>
    );
  }
});

function Language(comp){
  return {
    set(language){
      comp.setState({
        language: language
      });
    },
    get(key, defaultValue, args){
      // console.log(key);
      if(!key) return comp.state.language;
      if(typeof key !== 'string'){
        return console.error(`translate() expects a string. got '${typeof key}'`);
      }
      // path = path.split('.');
      if(defaultValue instanceof Array){
        var v = args;
        args = defaultValue;
        defaultValue = v;
      }
      var language = comp.state.language;
      if(!language) return defaultValue;
      var value = language[key] || defaultValue || '';
      if((value || "").indexOf('=>') > -1){
        value = parseAsFunction(value, args);
      }
      return value;
    }
  }
}

function ReportTemplates(comp){
  return {
    set(reportTpl){
      comp.setState({
        "reportTemplates": reportTpl
      });
    },
    get(key){
      var err;

      if(!key) return comp.state.reportTemplates;

      if(typeof key !== 'number') {
        err = new Error(`ReportTemplates() expects a number. got '${typeof key}'`);
        console.error(err);
        throw err;
      }

      for(var i in comp.state.reportTemplates)
        if(comp.state.reportTemplates[i].id === key)
          return comp.state.reportTemplates[i];

      err = new Error(`Report templates key '${typeof key}' not found.`);
      console.error(err);
      throw err;
    }
  }
}

function Config(comp){
  return {
    set(config){
      comp.setState({
        config: config
      });
    },
    get(key){
      if(!key) return comp.state.config;
      if(typeof key !== 'string'){
        return console.error(`App.config.get() expects a string. got '${typeof key}'`);
      }
      var path = key.split('.');
      var config = comp.state.config;
      if(!config) return null;
      var value = find(config, path);
      return value;
    }
  }
}


function Theme(comp, defaultTheme){
  return {
    set(path, value){
      if(typeof path === 'object'){
        return comp.setState({
          theme: path
        });
      }
      path = path.split('.');
      var theme = { ...comp.state.theme };
      if(set(theme, path, value)){
        comp.setState({
          theme: theme
        });
      }
    },
    get(path){
      if(!path) return comp.state.theme;
      var value = '';
      var theme = comp.state.config && comp.state.config.theme;
      if(!theme) {
        if(defaultTheme) theme = defaultTheme;
        else return null;
      }

      if(typeof path === 'string'){
        var value = find(theme, path.split('.'));
      }
      else if(typeof path === 'object'){
        var value = parseObjectToContext(path, theme);
      }
      else{
        console.error(`App.theme expects a string of dot notation. got '${typeof path}'`);
      }
      return value;
    }
  }
}

var App = function (tree, connection) {
  return {
    getInitialState(){
      this.connection = connection;
      this.tree = tree;
      this.language = Language(this);
      this.reportTemplates = ReportTemplates(this);
      this.theme = Theme(this, defaultTheme);
      this.config = Config(this);
      return {
        language: {}
      };
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
    log(type, args){
      if(this.state.logs[type]){
        args.unshift(`${type}: `);
        if(typeof args[0] === 'object') args.unshift('%O');
        console.debug.apply(console, args);
      }
    },
    render() {
      return (
        <Root tree={ this.tree }>
          { this.props.children }
        </Root>
      );
    }

  }
};

module.exports = App;
