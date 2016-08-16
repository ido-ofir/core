
module.exports = function(core){  // generates the 'Collection' function

  var valuesCursor = core.tree.select(['core', 'values']);

  function initializeValue(valueName, definition) {

      // clone the original definition and set defaults
      var value = { ...definition, name: valueName };
      if(!value.value){
        value.value = null;
      }
      value.set = function (value) {
        var params = { name: valueName, value: value };
        console.debug("params", params);
        return core.run('core.values.set', params);
      };
      return value;
  }

  core.Action(`core.values.set`, {
    "name": "string!",
    "value": "any"
  }, ({ name, value }, promise)=>{

    var cursor;
    if(core.isString(name)){
      cursor = valuesCursor.select({ name: name });
    }
    else{
      cursor = valuesCursor.select(name);
    }
    if(!cursor.exists()){
      throw new Error(`cannot find value ${ name }`);
    }
    cursor.set('value', value);
    core.tree.commit();
    promise.resolve(value);

  });

  return function value(name, definition){  // defines a value on the tree.

    var value = initializeValue(name, definition);

    var existing = valuesCursor.select({ name: name });
    if(existing.exists()){
      existing.set(value);
    }
    else{
      valuesCursor.push(value);
    }
  };
};
