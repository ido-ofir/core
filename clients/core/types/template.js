module.exports = {
  name: 'template',
  schema: {
    name: {
      $_type: 'string',
      value: ''
    },
    defaults: {
      $_type: 'object',
      ofType: 'componentName',
      members: []
    },
    get: {
      $_type: 'function',
      compiled: `function(){
        return function(props){  };
      }`
    }
  },
  build(definition){
    var app = this;
    var { name, dependencies, get, schema } = definition;
    if(!dependencies) dependencies = [];
    return app.injector.load(name, dependencies, (...modules) => {

      var body = get.apply(this, modules);

      var component = this.createComponent(name, {
        render(){
          return app.createElement(body);
        }
      });
      app.components[name] = component;
      if(callback) callback(component);
      return component;
    });
  }
};

var a = {
  name: {
    $_type: 'string',
    value: ''
  },
  dependencies: {},

}
