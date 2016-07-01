var React = require('react');
var PropTypes = React.PropTypes;

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
    this._watcher = core.tree.watch(bindings);
    this._watcher.on('update', this._updateBindings);
    return this._watcher.get();
  },
  _updateBindings(){
    if(this._watcher){
      var state = this._watcher.get();
      this.setState(state);
    }
  },
};

module.exports = Component;
