module.exports = {
  name: 'component',
  extends: 'module',
  build(definition){
    var { name, dependencies, get, value } = definition;
    var hasValue = ('value' in definition);
    var componentDefinition;
    if(hasValue){
      componentDefinition = value;
      dependencies = [];
    }
    if(!dependencies) dependencies = [];
    if(!this.isArray(dependencies)) dependencies = [dependencies];
    var component = this.injector.load(name, dependencies, (...modules) => {
      if( !hasValue ){
        componentDefinition = get.apply(this, modules);
      }
      var component = this.createComponent(name, componentDefinition);
      this.components[name] = component;
      return component;
    });
    return component;
  }
};
