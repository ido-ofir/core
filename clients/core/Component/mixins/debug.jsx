var lifeCycle = [
  'render',
  // 'getInitialState',
  // 'componentWillMount',
  'componentDidMount',
  // 'getChildContext',
  // 'componentWillReceiveProps',
  // 'shouldComponentUpdate',    // do not mock this one, it will prevent the render
  // 'componentWillUpdate',
  // 'componentDidUpdate',
  'componentWillUnmount'
];
function noop(){ return null; }
function Debug(componentName, methodName){  // handle errors and debug
  return function(){
    var returned;
    if(this._debug) this._debug(componentName, methodName, 'invoked', arguments);
    try {
      var method = this[`_${methodName}`];
      returned = method.apply(this, arguments);
    } catch (error) {
      this._handleError(componentName, methodName, arguments, error);
    } finally {
      if(this._debug) this._debug(componentName, methodName, 'returned', returned);
      return returned;
    }

  }
}

function debugMethods(componentName, definition){  // wraps each function on definition with a Debug method
  for (var i = 0; i < lifeCycle.length; i++) {
    if(!definition[lifeCycle[i]]){
      definition[lifeCycle[i]] = noop;
    }
  }
  for(var method in definition){
    if( (definition[method] instanceof Function) && (method.indexOf('_') !== 0) ){
      definition[`_${method}`] = definition[method]
      definition[method] = Debug(componentName, method);
    }
  }
}


module.exports = {
  getInitialState(){
    this._setState = this.setState;   // TODO - if (config.env === 'debug')
    this.setState = Debug(this.constructor.displayName, 'setState');
    return null;
  },
  _handleError(componentName, methodName, args, error){
    console.error(error, `in ${componentName}.${methodName}()`, args);
  },
  _debug(componentName, methodName, phase, data){
    // console.debug(`${componentName}.${methodName}()`, phase, data);
    this.root.dispatch('_debug', {
      name: componentName,
      method: methodName,
      phase: phase,
      data: data,
      time: new Date()
    });
  },
  debugMethods: debugMethods
};
