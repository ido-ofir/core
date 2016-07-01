var React = require('react');
var PropTypes = React.PropTypes;
var components = {};
var core = require('core');
var mixins = require('mixins');
var noop = function(){ return null; }
var lifeCycle = [
  'render',
  // 'getInitialState',
  'componentWillMount',
  'componentDidMount',
  // 'getChildContext',
  // 'componentWillReceiveProps',
  // 'shouldComponentUpdate',    // do not mock this one, it will prevent the render
  // 'componentWillUpdate',
  // 'componentDidUpdate',
  'componentWillUnmount'
];
window._debugStack = [];
var mixin = {
  mixins: [mixins.view],
  getInitialState(){
    this._setState = this.setState;   // TODO - if (KOKO_ENV.indexOf('debug') > -1)
    this.setState = Debug(this.constructor.displayName, 'setState');
    return null;
  },
  contextTypes: {
    env: PropTypes.string,
    component: PropTypes.object,
    shell: PropTypes.object
  },
  childContextTypes: {
    component: PropTypes.object
  },
  getChildContext(){
    return { component: this };
  },
  handleError(componentName, methodName, args, error){
    console.error(error, `in ${componentName}.${methodName}()`, args);
  },
  debug(componentName, methodName, phase, data){
    var item = {
      name: componentName,
      method: methodName,
      phase: phase,
      data: data,
      time: new Date().getTime()
    };
    // console.debug(`${componentName}.${methodName}()`, phase, data);
    // this.emit('debug', componentName, methodName, phase, data);
    // window._debugStack.push(item);
    // if(this.context.shell) this.context.shell.debug(item);
  },
  renderTemplate(template){
    return (<div>okkk</div>)
  }
};

function Debug(componentName, methodName){
  return function(){
    var returned;
    if(this.context.env === 'debug') this.debug(componentName, methodName, 'invoked', arguments);
    try {
      var method = this[`_${methodName}`];
      returned = method.apply(this, arguments);
    } catch (error) {
      this.handleError(componentName, methodName, arguments, error);
    } finally {
      if(this.context.env === 'debug') this.debug(componentName, methodName, 'returned', returned);
      return returned;
    }

  }
}

function debugMethods(componentName, definition){
  for (var i = 0; i < lifeCycle.length; i++) {
    if(!definition[lifeCycle[i]]){
      definition[lifeCycle[i]] = noop;
    }
  }
  for(var method in definition){
    if(method !== 'debug' && definition[method] instanceof Function){
      definition[`_${method}`] = definition[method]
      definition[method] = Debug(componentName, method);
    }
  }
}

var Component = function(name, definition){
  var component;
  if(components[name]) return console.error(`there is more than one component called '${name}', component names must be unique..`);
  if(!definition.mixins) definition.mixins = [];
  definition.mixins.push(mixin);
  debugMethods(name, definition);     //  TODO - if (KOKO_ENV.indexOf('debug') > -1)
  component = React.createClass(definition);
  component.displayName = name;
  component.propTypes = definition.propTypes;
  components[name] = component;
  return component;
};

Component.components = components;

module.exports = Component;
