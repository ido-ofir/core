

module.exports = function(wares) {
  wares = wares ? (Array.isArray(wares) ? wares : [].slice.call(arguments)) : [];
  var middleware = function(req, res, next) {
    var i = 0,
        args = [].slice.call(arguments),
        next = args.pop(),
        done = false;
    if(!wares.length) return next();
    function run() {
      i++;
      done = wares[i];
      wares[i - 1].apply(null, args.concat(done ? [run] : [next]));
    }
    run();
  };
  middleware.use = function() {
    wares.push.apply(wares, arguments);
    return middleware;
  };
  middleware.wares = wares;
  return middleware;
};
