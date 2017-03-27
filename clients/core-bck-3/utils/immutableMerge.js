
// recursive immutable merge.
// all changed values and their containers will be different.
// the rest will stay the same.

module.exports = function immutableMerge(oldValue, newValue){
  var changed = false;
  var result, oldKeys, newKeys;
  if(newValue === oldValue || !newValue || !oldValue || typeof newValue !== 'object' || typeof oldValue !== 'object'){ return newValue; }

  // merge as array
  if(Array.isArray(newValue)){
    if(!Array.isArray(oldValue)){ return newValue; }
    result = [];
    newValue.map((item, index) => {
      var oldItem = oldValue[index];
      var newItem = immutableMerge(oldItem, item);
      if(newItem !== oldItem){ changed = true; }
      result[index] = newItem;
    });
    if(!changed && (newValue.length === oldValue.length)){
      return oldValue;
    }
    return result;
  }
  // merge as object
  else{
    if(Array.isArray(oldValue)){ return newValue; }
    result = {};
    oldKeys = Object.keys(oldValue);
    newKeys = Object.keys(newValue);
    newKeys.map((key, index) => {
      var newItem = immutableMerge(oldValue[key], newValue[key]);
      if(newItem !== oldValue[key]){ changed = true; }
      result[key] = newItem;
    });
    if(!changed && newKeys.length === oldKeys.length){
      return oldValue;
    }
    return result;
  }
};
