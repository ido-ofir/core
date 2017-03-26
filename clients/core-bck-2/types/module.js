module.exports = {
  name: 'module',
  schema: {
    name: {
      $_type: 'string',
      description: 'The name of the module.',
      isRequired: true
    },
    dependencies: {
      $_type: 'array',
      ofType: 'module',
      description: `locally defined dependencies.`,
      items: []
    },
    get: {
      $_type: 'function',
      source: '() => {  }',
      compiled: 'function(){  }'
    }
  },
  build(definition){
    var { name, dependencies, get, value } = definition;
    if('value' in definition){
      this.injector.load(name, value);
    }
    else{
      this.injector.load(name, dependencies, get.bind(this));
    }
  }
};
