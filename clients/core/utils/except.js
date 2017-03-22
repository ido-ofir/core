
// clone [source] and exclude all property names in following arguments.

module.exports = function except(source, rest) {
  var target = {};
  var args = [].slice.call(arguments, 1);
  for(var m in source){
    if(args.indexOf(m) === -1) target[m] = source[m];
  }
  return target;
}
