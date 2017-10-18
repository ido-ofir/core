

module.exports = function (def) {
  var index, str, last, array;
  if(typeof def === 'string'){
    str = def;
    def = {
      types: [],
      required: false,
      description: ''
    };
    array = str.split(':');
    if(array[1]){
      def.description = array[1].trim();
    }
    str = array[0];
    index = str.indexOf('!');
    if(index > -1){
      def.required = true;
      str = str.split('!')[0];
    }
    def.types = str.split('~').map(t => t.trim());
    if(def.types.length === 1){
      def.type = def.types[0];
    }
  }
  else{
    if(!def.types){
      def.types = [def.type];
    }
  }
  return def;
}
