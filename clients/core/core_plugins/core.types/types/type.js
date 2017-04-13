module.exports = {
  name: 'type',
  recursive: false,
  schema: {
    name: {
      type: 'string',
      description: 'The name of the type.',
      required: true
    },
    recursive: {
      type: 'boolean',
      value: true,
      description: `Set to false if you don't want to automatically build the children of your type's instance definition.`
    },
    schema: {
      type: 'schema',
      value: {
        name: {
          type: 'string',
          description: '',
          required: true
        },
      },
      description: 'Defines the interface of your type'
    },
    preBuild: {
      type: 'function',
      description: `Will run before any of the children have been built. expected to return a new source. if 'recursive' if set to false this function will not run.`
    },
    build: {
      type: 'function',
      description: `If 'recursive' if set to true - will run after all of the children have been built. if 'recursive' if set to false this function will be envoked with the source.`
    }
  },
  build(definition){
    var core = this;
    var type = definition;
    type.constructor = new Function(`
      return function ${ definition.name }(d){ for(var m in d){ this[m] = d[m]; } };
    `)();
    core.types[definition.name] = type;
    return type;
  }
};
