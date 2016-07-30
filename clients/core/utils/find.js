
module.exports = function find(id, array, field){
  if(!id) return false;
  field = field || 'id';
  id = id.toString();
  for (var i = 0; i < array.length; i++) {
      if(array[i][field]){
      if(array[i][field].toString() === id) return array[i];
    }
  }
};
