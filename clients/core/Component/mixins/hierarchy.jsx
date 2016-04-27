
var React = require('react');
var PropTypes = React.PropTypes;

// depends on ./dispatcher.jsx

module.exports = {
  contextTypes: {
    parent: PropTypes.object,
    root: PropTypes.object
  },
  childContextTypes: {
    parent: PropTypes.object,
    root: PropTypes.object
  },
  getChildContext(){
    return {
      parent: this,
      root: this.context.root || this
    }
  },
  getInitialState(){
    this._children = [];
    this.root = this.context.root || this;
  },
  getElementById(id){
    var child;
    if(this._children){
      for (var i = 0; i < this._children.length; i++) {
        if(this._children[i].id === id) return this._children[i];
        child = this._children[i].getElementById(id);
        if(child) return child;
      }
    }
  },
  componentDidMount(){
    var listenerName;
    if(this.context.parent) this.context.parent._registerChild(this);
    if(this.events){
      for(var eventName in this.events){
        listenerName = this.events[eventName];
        if(typeof listenerName === 'string'){
          if(this[listenerName]){
            this.on(eventName, this[listenerName])
          }
          else console.error(`cannot find method ${listenerName} in ${this.constructor.displayName}`);
        }
      }
      if(this.events.root){
        for(eventName in this.events.root){
          listenerName = this.events.root[eventName];
          this.root.on(eventName, this[listenerName])
        }
      }
    }
  },
  componentWillUnmount(){
    var listenerName;
    if(this.context.parent) this.context.parent._unregisterChild(this);
    if(this.events){
      if(this.events.root){
        for(var eventName in this.events.root){
          listenerName = this.events.root[eventName];
          this.root.off(eventName, this[listenerName])
        }
      }
      this.off(); // remove all local event listeners
    }
  },
  _registerChild(child){
    if(this._children.indexOf(child) > -1) return;
    this._children.push(child);
  },
  _unregisterChild(child){
    this._children.splice(this._children.indexOf(child), 1);
  },
  emit(eventName, any){  // dispatch an event and bubble upwards to the parent.
    var bubbles = this.dispatch.apply(this, arguments);
    if(bubbles){
      var parent = this.context.parent;
      if(parent){
        parent.emit.apply(parent, arguments);
      }
    }
    return bubbles;
  },
  broadcast(eventName, any){  // dispatch an event and seep downwards to all children.
    var child, seeps = this.dispatch.apply(this, arguments);
    if(seeps){
      for (var i = 0; i < this._children.length; i++) {
        child = this._children[i];
        child.broadcast.apply(child, arguments);
      }
    }
    return seeps;
  }
};
