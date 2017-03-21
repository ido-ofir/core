
module.exports = function inherit(proto, construc){
  var mid = Object.create(proto);
  Object.defineProperty(mid, 'constructor', {
    value: construc
  });
  construc.prototype = mid;
};
