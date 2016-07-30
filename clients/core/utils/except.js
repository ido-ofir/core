
// clone [source] and exclude all property names in following arguments.

module.exports = function except(source, ...args) {
  var target = {};
  for(var m in source){
    if(args.indexOf(m) === -1) target[m] = source[m];
  }
  return target;
}
