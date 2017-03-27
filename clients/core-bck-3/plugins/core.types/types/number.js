module.exports = {
  name: 'number',
  schema: {
    value: 'number'
  },
  build(def){
    return Number(def && def.value);
  }
};
