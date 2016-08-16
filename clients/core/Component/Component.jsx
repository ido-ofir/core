var React = require('react');
var PropTypes = React.PropTypes;

function getPropTypes(propTypes) {
  var key, type, PropType, index, required;
  var pt = {};
  for(key in propTypes){
    type = propTypes[key];
    if(!core.isString(type)) {
      pt[key] = propTypes[key];
      continue;
    }
    index = type.indexOf('!');  // a required param has an '!' at the end.
    required = index > -1;
    if(required) type = type.substr(0, index);
    PropType = PropTypes[type]
    if(!PropType) return console.error(`cannot find PropType ${type}`);
    if(required){  // if it's required and missing - fail.
      pt[key] = PropType.isRequired;
    }
    else{
      pt[key] = PropType;
    }
  }
  return pt;
}

function Component(name, definition){

  var ComposedComponent, component;

  // if definition is a function it is a react class or a stateless component function,
  // so we will return a higher order component.
  if(definition instanceof Function){
    ComposedComponent = definition;
    component = Component(name, {
      render(){
        return core.createElement(ComposedComponent, this.props);
      }
    });
    // if(!proto.ui) = proto.ui  // TODO:  higher order constructor
  }
  else{
    definition = { ...definition };
    if(!definition.mixins) definition.mixins = [];
    definition.mixins.unshift(mixin);
    if(definition.propTypes){
      definition.propTypes = getPropTypes(definition.propTypes);
    }
    if(definition.childContextTypes){
      definition.childContextTypes = getPropTypes(definition.childContextTypes);
    }
    component = React.createClass(definition);
    component.displayName = name;
    if(definition.enhancers){  // enhancers is an array of higher order constructors.
      definition.enhancers.map((higherOrder)=>{
        component = higherOrder(component);
      });
    }
  }
  return component;
}

var mixin = {
  getInitialState(){
    var bindings = {};
    if(this.bindings){  // bind each binding to its branch on the tree.
      this.watch(this.bindings);
    }

    var state = (this._watcher ? this._watcher.get() : null);
    return state;
  },
  componentDidMount(){
    if(this.events){
      this._events = {};
      for(var m in this.events){
        this._events[m] = this.events[m].bind(this);
        core.on(m, this._events[m])
      }
    }
  },
  componentWillUnmount(){
    if(this._watcher){
      this._watcher.off('update', this._updateBindings);
    }
    if(this._events){
      for(var m in this._events){
        core.off(m, this._events[m])
      }
    }
  },
  watch(bindings){
    if(this._watcher){
      this.unwatch();
    }
    this._watcher = core.tree.watch(bindings);
    this._watcher.on('update', this._updateBindings);
    return this._watcher.get();
  },
  unwatch(){
    this._watcher.off('update', this._updateBindings);
  },
  _updateBindings(){
    if(this._watcher){
      var state = this._watcher.get();
      this.setState(state);
    }
  },
};

module.exports = Component;
