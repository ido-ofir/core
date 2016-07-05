
module.exports = function(core){  // generates the 'Collection' function

  var collectionsCursor = core.tree.select(['core', 'collections']);

  function initializeCollection(collectionName, definition) {

      // clone the original definition and set defaults
      var collection = { ...definition, name: collectionName };
      if(!collection.items) collection.items = [];
      return collection;
  }

  core.Action(`core.collections.get`, {
    "collection": "string ~ object!",
    "query": "number ~ object"
  }, ({ collection, query }, promise)=>{

    var collectionCursor;
    if(core.isString(collection)){
      collectionCursor = collectionsCursor.select({ name: collection });
    }
    else{
      collectionCursor = collectionsCursor.select(collection);
    }
    if(!collectionCursor.exists()){
      return console.error(`cannot find collection ${ collection.name || collection }`);
    }
    var path = ['items'];
    if(query || query === 0){
      path.push(query);
    }
    promise.resolve(collectionCursor.get(path));

  });

  core.Action(`core.collections.push`, {
    "collection": "string ~ object!",
    "item": "any!",
    "index": "number"
  }, ({ collection, item, index }, promise)=>{

    var itemsCursor;
    if(core.isString(collection)){
      itemsCursor = collectionsCursor.select({ name: collection }, 'items');
    }
    else{
      itemsCursor = collectionsCursor.select(collection, 'items');
    }
    if(!itemsCursor.exists()){
      return console.error(`cannot find collection ${ collection.name || collection }`);
    }
    if(index || index === 0){
      itemsCursor.splice([index, 0, item]);
      promise.resolve(item);
    }
    else {
      itemsCursor.push(item);
      promise.resolve(item);
    }
  });

  core.Action(`core.collections.pop`, {
    "collection": "string ~ object!",
    "index": "number"
  }, ({ collection, item, index }, promise)=>{

    var itemsCursor;
    if(core.isString(collection)){
      itemsCursor = collectionsCursor.select({ name: collection }, 'items');
    }
    else{
      itemsCursor = collectionsCursor.select(collection, 'items');
    }
    if(!itemsCursor.exists()){
      return console.error(`cannot find collection ${ collection.name || collection }`);
    }
    if(index || index === 0){
      promise.resolve(itemsCursor.splice([index, 1]));
    }
    else {
      itemsCursor.pop();
      promise.resolve(itemsCursor.get());
    }
  });

  return function Collection(collectionName, definition){  // defines a form on the tree and sets up default values.

    var collection = initializeCollection(collectionName, definition);

    var existing = collectionsCursor.select({ name: collectionName });
    if(existing.exists()){
      existing.set(collection);
    }
    else{
      collectionsCursor.push(collection);
    }
  };
};
