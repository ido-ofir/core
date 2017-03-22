
function unset(source, path) {
  var result = Array.isArray(source) ? [].concat(source) : Object.assign({}, source);
  var target = result;
  if(typeof path === 'string'){
    path = path.split('.');
  }
  var property = path.pop();
  path.map((t, i) => {
    target[t] = Array.isArray(target[t]) ? [].concat(target[t]) : Object.assign({}, target[t]);
    target = target[t];
  });
  if(!(property in target)){ // if it doesn't exist return the source.
    return source;
  }
  delete target[property];
  return result;
}

module.exports = unset;
