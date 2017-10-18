module.exports = {
  name: 'value',
  schema: {
    type: {
      type: 'string',
      description: 'the name of the type of this parameter.'
    },
    description: {
      type: 'string',
      description: 'decribes the purpose of this parameter.',
    },
    required: {
      type: 'boolean',
      description: 'if set to true this parameter will be required to have a non-empty value.',
    },
    
  },
  build(source){
    // TODO: validate schema
    return source;
  }
};
