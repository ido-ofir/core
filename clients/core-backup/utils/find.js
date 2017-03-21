
module.exports = function find(array, q) {
  var i, m, passed;
  for (i = 0; i < array.length; i++) {
    if(array[i] === q) return array[i];
    passed = true;
    for(m in q){
      if(q[m] !== array[i][m]){
        passed = false;
        break;
      }
    }
    if(passed) return array[i];
  }
}
