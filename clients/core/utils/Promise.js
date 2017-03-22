
var Q = require('q');

function callback(err, rest) {
  var args = [].slice.call(arguments);
  if(err !== null){
    return this.reject(err);
  }
  return this.resolve.apply(this, args);
}
module.exports = function Promise() {
  var defered = Q.defer();
  defered.callback = callback;
  return defered;
}
