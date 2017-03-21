module.exports = {
  name: 'any',
  schema: {
    value: 'any'
  },
  validate(){
    return true;
  },
  build(def){
    if(!def) return def;
    if(def['$_type'] === 'any'){
      return def.value;
    }
    return def;
  }
};
