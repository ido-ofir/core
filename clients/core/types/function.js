module.exports = {
  name: 'function',
  schema: {
    compiled: {
      $_type: 'string',
    },
    source: {
      $_type: 'string'
    },
    value: {
      $_type: 'boolean'
    }
  },
  build(target, path){
    if(target.value) return target.value;
    var compiled = target.compiled;
    if(!compiled) throw new Error(`cannot find compiled code in function ${this.name}.${path.join('.')}`);
    return eval(compiled);
  }
};
