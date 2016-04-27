
// creates an in-memory cache of a collection in the database.
// whenever the collection in the db changes, this local cache will be updated to the new value.

var Emitter = require('./Emitter.js');

module.exports = function(routeName, api, callback){
  var items = [];
  var route = api.routes[routeName];
  var model = api.models[routeName.toLowerCase()];
  if(!route) return console.error('cannot find route ' + routeName);
  if(!model) return console.error('cannot find model ' + routeName.toLowerCase());

  function findById(id){
    for (var i = 0; i < items.length; i++) {
      if(items[i] && (items[i].id === id)) return items[i];
    }
  }

  route.after('create', function(event, next){
    items.push(event.data);
    next();
  });
  route.after('update', function(event, next){
    var dbItems = event.data;
    dbItems.forEach(function(dbItem){
      if(!dbItem || !dbItem.id) return;
      var existing = findById(dbItem.id);
      if(!existing) return console.error('cannot find item with id '+ dbItem.id + ' in ' + routeName + ' cache');
      dbItem = dbItem.toJSON();
      for(var m in dbItem){
        existing[m] = dbItem[m];
      }
    });
    next();
  });
  route.after('delete', function(event, next){
    var dbItems = event.data;
    dbItems.forEach(function(dbItem){
      if(!dbItem || !dbItem.id) return;
      var existing = findById(dbItem.id);
      if(!existing) return console.error('cannot find item with id '+ dbItem.id + ' in ' + routeName + ' cache');
      items.splice(items.indexOf(existing), 1);
    });
    next();
  });


  var cache = Emitter({
    find: findById,
    items: items,
    update: function(newItem){
      if(!newItem.id) retrun;
      var item = findById(newItem.id);
      var index = items.indexOf(item);
      items[index] = newItem;
    },
    load: function(callback){
      model.find({}, function(err, _items){
        if(err) return console.error(err);
        items.push.apply(items, _items);
        callback();
      });
    }
  });
  return cache;
};
