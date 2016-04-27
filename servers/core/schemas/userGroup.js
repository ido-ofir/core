var userGroup = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    name  : { type: 'string' },
    members     : { type: 'array' }
  }
};

module.exports = userGroup;
