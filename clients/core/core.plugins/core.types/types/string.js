module.exports = {
  name: 'string',
  schema: {
    value: 'string'
  },
  create(){
    return {
      $_type: 'string',
      value: ''
    };
  },
  build(def){
    return String(def && def.value);
  }
};
