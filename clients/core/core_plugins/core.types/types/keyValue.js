module.exports = {
  name: 'keyValue',
  schema: {
    key: {
      $_type: 'string',
      isRequired: true
    },
    value: {
      $_type: 'any'
    }
  },
  build(def){
    return def;
  }
};
