
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

module.exports = function ArrayFind(array){
  if(!Array.isArray(array)){
    array = [ ...arguments ];
  }
  array.find = find;
  return array;
};
