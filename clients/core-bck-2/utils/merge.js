
module.exports = function merge(){
  var result = {};
  var obj;
  for (var i = 0; i < arguments.length; i++) {
    obj = arguments[i];
    for(var m in obj) result[m] = obj[m];
  }
  return result;
};
