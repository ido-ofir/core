module.exports = function getPropTypes(propTypes, PropTypes) {
  if(!propTypes) return;
  var key, item, PropType, index, required;
  var pt = {};
  for(key in propTypes){
    item = propTypes[key];
    if(typeof item === 'function') {
      pt[key] = item;
      continue;
    }
    if(item instanceof Object && !(Array.isArray(item))){
      PropType = PropTypes[item.type];
      if(!PropType) throw new Error(`cannot find PropType ${key}`);
      if(item.required){
        pt[key] = PropType.isRequired;
      }
      else{
        pt[key] = PropType;
      }
    }
  }
  return pt;
}
