module.exports = {
  name: 'code',
  schema: {
    compiled: {
      $_type: 'string',
      isRequired: true
    },
    source: {
      $_type: 'string'
    },
    build: {
      $_type: 'boolean'
    }
  },
  build(target, path){
    var compiled = target.compiled;
    if(!compiled) throw new Error(`cannot find compiled code in ${this.name}.${path.join('.')}`);
    var evaled = eval(compiled);
    if(target.build){
      return this.build(evaled);
    }
    return evaled;
  }
};
