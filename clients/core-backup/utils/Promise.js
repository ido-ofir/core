
var Q = require('q');

function callback(err, ...args) {
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
