var React = require('react');
var PropTypes = React.PropTypes;

var mixins = require('./mixins');



function Component(name, definition){

  var proto, component;

  // if definition is a function it is a react class or a stateless component function,
  // so we will return a higher order component.
  if(definition instanceof Function){
    component = definition;
    proto = component.prototype;
    // if(!proto.ui) = proto.ui  // TODO:  higher order constructor
  }
  else{
    definition = { ...definition };
    if(!definition.mixins) definition.mixins = [];
    definition.mixins.unshift(mixin);  // the mixin makes each instance of this component a node in an internal event system.
    // if(definition.debug) {
    //   mixins.debug.debugMethods(name, definition);     // wraps all methods of this component in a try catch and an optional debugger
    //   definition.mixins.push(mixins.debug);
    // }
    var component = React.createClass(definition);
    component.displayName = name;
    component.propTypes = definition.propTypes;  // this will just help us see the props schema on the actual component.
    if(definition.enhancers){
      definition.enhancers.map((higherOrder)=>{
        component = higherOrder(component);
      });
    }
  }
  return component;
}

function Mixin(name, definition){
  // debugMethods(name, definition);
  return definition;
}




var mixin = {
  mixins: [mixins.dispatcher, mixins.hierarchy, mixins.theme, mixins.translate],
  contextTypes: {
    app: PropTypes.object
  },
  getInitialState(){
    var app, bindings = {}, id = this.props.id;
    if(id){ // this component's id is composed from all of it's parents' ids.
      // console.log('gis id', id);
      var parentId = getParentId(this);
      // console.log('parentId', parentId);
      this.id = parentId ? `${parentId}.${id}` : id;
    }
    if(this.bindings){  // bind each binding to its branch on the tree.
      app = this.context.app || this;
      for(var m in this.bindings){  // use dot notation as a shortcut
        bindings[m] = typeof this.bindings[m] === 'string' ? this.bindings[m].split('.') : this.bindings[m];
      }
      this.watch(bindings);
    }
    if(this.forms){

    }
    this.route = this.props.route || (this.context.parent ? this.context.parent.route : {});
    var state = (this._watcher ? this._watcher.get() : null);
    return state;
  },
  componentWillReceiveProps(props){
    this.route = props.route || (this.context.parent ? this.context.parent.route : {});
  },
  watch(bindings){
    this._watcher = core.tree.watch(bindings);
    this._watcher.on('update', this._updateBindings);
  },
  _updateBindings(){
    if(this._watcher){
      var state = this._watcher.get();
      this.setState(state);
    }
  },
  componentWillUnmount(){
    if(this._watcher){
      this._watcher.off('update', this._updateBindings);
    }
  },
  renderTemplate(template, key){
    if(!template) return null;
    var style, rule, i;
    if(template.type) {
      var props = { ...template.props };
      if(!props.key) props.key = key || 0;
      var children = template.children || [];
      if(template.styles){
        style = {};
        template.styles.map((name)=>{
          if(this.styles[name]){
            for(rule in this.styles[name]){
              style[rule] = this.styles[name][rule];
            }
          }
        });
        if(props.style){
          for(rule in props.style){
            style[rule] = props.style[rule];
          }
        }
        props.style = style;
      }
      return React.createElement(template.type, props, template.children.map(this.renderTemplate))
    }
    return template;
  }
};



function getParentId(target){
  while(target){
    // console.dir(target.id)
    if(target.id) {
      // console.log('return');
      return target.id;
    }
    target = target.context.parent;
  }
}
function getStyle(target, key){
  var styles;
  while(target){
    styles = target.props.styles;
    if(styles && styles[key]) return styles[key];
    target = target.context.parent;
  }
}

Component.Mixin = Mixin;
module.exports = Component;
