
var React = require('react');

module.exports = function(components){

  function render(object, key){
    if(!object) return null;
    if(typeof object === 'string') {
      // return render({type: object}, key);
      return object;
    }
    if(!(object instanceof Object)) return null;
    var type, keys, props, children;
    if(!object.type){
      keys = Object.keys(object);
      if(keys.length !== 1) return null;
      type = keys[0];
      object = object[type];
      if(object instanceof Array){
        return render({
          type: type,
          children: object
        }, key);
      }
      if(!(object instanceof Object)) return null;
      return render({ ...object, type: type}, key);
    }
    type = object.type;
    props = object.props || {};
    if(!props.key) props.key = key;
    var children = object.children || object[core.symbols.children] || null;
    if(children){
      if(!Array.isArray(children)){
        children = [render(children, 0)];
      }
      else{
        children = children.map(render);
      }
    }
    var component = components[type];
    if(!component) {
      console.error(`cannot find component ${type}`);
      component = 'div';
    }
    return React.createElement(component, props, children);
  }

  return {
    render: render,
    Render(object, key){
      return function(){
        return render(object, key);
      }
    }
  };
}
