module.exports = {
  name: 'function',
  schema: {
    compiled: {
      type: 'string',
    },
    source: {
      type: 'string'
    },
    value: {
      type: 'function'
    }
  },
  build(target, path){
    if(target.value) return target.value;
    var compiled = target.compiled;
    if(!compiled) throw new Error(`cannot find compiled code in function ${this.name}.${path.join('.')}`);
    return eval(compiled);
  }
};
