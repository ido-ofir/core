module.exports = {
  name: 'type',
  recursive: false,
  schema: [
    {
      key: '$_type',
      type: 'string',
      description: 'The name of the type.',
      required: true
    },
    {
      key: 'name',
      type: 'string',
      description: 'The name of the type.',
      required: true
    },{
      key: 'recursive',
      type: 'boolean',
      description: `Set to false if you don't want to automatically build the children of your type's instance definition.`,
      value: true
    },{
      key: 'schema',
      type: 'array',
      description: 'A schema that defines the interface of this type',
      items: []
    },{
      key: 'preBuild',
      type: 'function',
      description: `Will run before any of the children have been built. expected to return a new source. if 'recursive' if set to false this function will not run.`,
    },{
      key: 'build',
      type: 'function',
      description: `If 'recursive' if set to true - will run after all of the children have been built. if 'recursive' if set to false this function will be envoked with the source.`,
      required: true
    },{
      key: 'postBuild',
      type: 'function',
      description: `Will run after any of the children have been built. expected to return a new source. if 'recursive' if set to false this function will not run.`,
      required: true
    }
  ],
  build(definition){
    var core = this;
    var type = definition;
    core.types[definition.name] = type;
    return type;
  }
};
