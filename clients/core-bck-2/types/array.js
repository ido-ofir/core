module.exports = {
  name: 'array',
  recursive: true,
  schema: {
    ofType: {
      $_type: 'string',
      ofType: 'type'
    },
    description: {
      $_type: 'string',
      items: []
    },
    items: {
      $_type: 'array',
      items: []
    }
  },
  build(def){
    if(!def) return this.Array();
    var items = this.isArray(def) ? def : (def.items || []);
    return this.Array(items);
  }
};
