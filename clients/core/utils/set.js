
// immutably set [path] on [source] to [value].
// if [value] is different then the current value a new object is returned
// and all the sub objects or arrays that contained the change are cloned as well.
// if [value] was not changed [source] is returned.
function set(source, path, value){
  var result = Array.isArray(source) ? [ ...source ] : { ...source };
  var target = result;
  if(typeof path === 'string'){
    path = path.split('.');
  }
  var property = path.pop();
  path.map((t, i) => {
    target[t] = Array.isArray(target[t]) ? [ ...target[t] ] : { ...target[t] };
    target = target[t];
  });
  if(target[property] === value){ // if nothing changed return the source
    return source;
  }
  target[property] = value;
  return result;
}

module.exports = set;
