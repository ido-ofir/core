
function find(q) {
  var i, m, passed;
  for (i = 0; i < this.length; i++) {
    if(this[i] === q) return this[i];
    passed = true;
    for(m in q){
      if(q[m] !== this[i][m]){
        passed = false;
        break;
      }
    }
    if(passed) return this[i];
  }
}

function ArrayFind(array){
  if(!Array.isArray(array)){
    array = [].slice.call(arguments);;
  }
  array.find = find;
  return array;
};

module.exports = {
    name: 'core.Array',
    extend: {
        Array: ArrayFind
    }
};