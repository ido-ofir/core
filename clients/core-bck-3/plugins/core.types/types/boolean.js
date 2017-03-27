module.exports = {
  name: 'boolean',
  schema: {
    value: 'boolean'
  },
  build(def){
    return Boolean(def && def.value);
  }
};
