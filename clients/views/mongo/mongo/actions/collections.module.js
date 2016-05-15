
var core = require('core');


core.Action('mongo.getCollectionsList', [
  'mongo.socket',
  'mongo.tree',
], (socket, tree)=>{
  return (data, done)=>{
    socket.action('listCollections').then((collections)=>{

        tree.set('collections', collections);
        core.action('mongo.getCollection', collections[0].name);

      }).catch((err)=>{
        core.action('mongo.error', err)
      });
  }
});


core.Action('mongo.setCollection', [
  'mongo.tree',
], (tree)=>{
  return (data, done)=>{  // data = { items: [], name: 'cats'}

    tree.select('selectedCollection').set(data);

    core.action('mongo.setDocument', (data.items && data.items[0]) || null);

  }
});


core.Action('mongo.getCollection', [
  'mongo.socket',
  'mongo.tree',
], (socket, tree)=>{
  return (name, done)=>{
    socket.action('getCollection', name).then((collection)=>{

      core.action('mongo.setCollection', {
        name: name,
        items: collection
      });

    }).catch((err)=>{
      core.action('mongo.error', err)
    });
  }
});


core.Action('mongo.removeCollection', [
  'mongo.socket',
  'mongo.tree',
], (socket, tree)=>{
  return (name, done)=>{

    var cursor = tree.select('collections', {"name": name});

    socket.action('removeCollection', name).then(()=>{

      if(cursor.exists()){  // if the item exists, remove it.
        var current = tree.get('selectedCollection');
        if(name === current.name){
          var previous = cursor.left();
          if(!previous.exists()) {
            previous = cursor.leftmost();
          }
          if(previous.exists()){
            core.action('mongo.getCollection', previous.get().name);
          }
        }
        cursor.unset();
      }

    }).catch((err)=>{
      core.action('mongo.error', err)
    });
  }
});


core.Action('mongo.addCollection', [
  'mongo.socket',
  'mongo.tree',
], (socket, tree)=>{
  return (name, done)=>{
    socket.action('addCollection', name).then(()=>{

      tree.select('collections').push({name: name, count: 0});
      tree.select('selectedCollection').set({
        name: name,
        items: []
      });
      core.action('mongo.setDocument', null);

    }).catch((err)=>{
      core.action('mongo.error', err)
    });
  }
});
