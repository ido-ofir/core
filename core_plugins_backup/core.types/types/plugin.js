

function Set(name){
  return function set(path, value){
    if(arguments.length === 1){
      value = path;
      path = [];
    }
    if(!this.isArray(path)){
      path = [path];
    }
    return this.tree.set(['plugins', name].concat(path) , value);
  }
}
function Get(name){
  return function get(path){
    if(!this.isArray(path)){
      path = [path];
    }
    return this.tree.get(['plugins', name].concat(path));
  }
}
function Select(name){
  return function get(path){
    if(!this.isArray(path)){
      path = [path];
    }
    return this.tree.select(['plugins', name].concat(path));
  }
}

module.exports = {
  name: 'plugin',
  recursive(def){
    return def && !!def.recursive;
  },
  schema: {
    name: {
      $_type: 'string',
      value: ''
    },
    dependencies: {
      $_type: 'array',
      items: []
    }
  },
  build(definition){
    if(!definition) throw new Error('Empty plugin definition');
    var { name, dependencies } = definition;
    if(!name) throw new Error('Plugin must have a name');
    return this.plugin(definition);
  }
};
