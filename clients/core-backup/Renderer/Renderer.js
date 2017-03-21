
var React = require('react');

module.exports = function(core){

  var symbol = '<>';

  function render(object, key){
    if(!object) return null;
    if(core.isString(object)) {
      // return render({type: object}, key);
      return object;
    }
    if(!core.isObject(object)) return null;
    var type, value, keys, props, children, renderedChildren;
    if(!object.type){
      keys = Object.keys(object);
      if(keys.length !== 1) return null;
      type = keys[0];
      value = object[type];
      if(core.isArray(value)){
        return render({
          type: type,
          children: value
        }, key);
      }
      if(!core.isObject(value)) return null;
      return render({ type: type, props: value }, key);
    }
    type = object.type;
    props = object.props || {};
    if((arguments.length > 1) && !props.key) props.key = key;
    var children = object.children || object[symbol] || null;
    if(children){
      if(!core.isArray(children)){
        renderedChildren = [render(children, 0)];
      }
      else{
        renderedChildren = children.map(render);
      }
    }
    var component = core.components[type];
    if(!component) {
      console.error(`cannot find component ${type}`);
      component = 'div';
    }
    return core.createElement(component, props, renderedChildren);
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
