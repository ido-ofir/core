module.exports = {
  name: 'object',
  recursive: false,
  schema: {
    members: {
      $_type: 'array',
      ofType: 'keyValue'
    }
  },
  build(def){
    var object = {};
    var members = def.members || [];
    for (var i = 0; i < members.length; i++) {
      object[members[i].key] = this.build(members[i].value);
    }
    return object;
  }
};
