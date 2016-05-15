
var core = require('core');

core.Action('mongo.setDocument', [
  'mongo.tree',
], (tree)=>{
  return (newDoc)=>{ // doc = { name: '' }
    if(!newDoc){
      tree.select('docString').set('');
      tree.select('selectedDocument').set(null);
    }
    try{
      var docString = JSON.stringify(newDoc, null, 4);
      tree.select('docString').set(docString);
      tree.select('selectedDocument').set(newDoc);

    }
    catch(err) { console.error(err); }
  };
});

core.Action('mongo.getDocument', [
  'mongo.socket',
  'mongo.tree',
], (socket, tree)=>{
  return (data, done)=>{  // data = { collection: 'cats', id: '123' }
    socket.action('getDocument', data).then((doc)=>{

      core.action('mongo.setDocument', doc);

    }).catch((err)=>{
      core.action('mongo.error', err)
    });
  }
});



core.Action('mongo.removeDocument', [
  'mongo.socket',
  'mongo.tree',
], (socket, tree)=>{



  return (data, done)=>{  // data = { collection: 'cats', id: '123' }
    socket.action('removeDocument', data).then(()=>{
      var collection = tree.select(['collections', { name: data.collection }]);
      var doc = tree.select('selectedCollection', 'items', {"_id": data.id});
      if(doc.exists()) {
        var id = tree.get('selectedDocument', '_id');
        if(id === data.id){ // if the selected document is being removed, select the previous document.
          var selected = doc.left();
          if(selected.exists()){
            core.action('mongo.getDocument', {
              collection: data.collection,
              id: selected.get('_id')
            });
          }
        }
        doc.unset();
      }

      collection.set(['count'], collection.get('count') - 1);

    }).catch((err)=>{
      core.action('mongo.error', err)
    });
  }
});

core.Action('mongo.createDocument', [
  'mongo.socket',
  'mongo.tree',
], (socket, tree)=>{
  return (doc)=>{ // doc =  { collection: 'cats', document: { .. } }
    socket.action('createDocument', doc).then((newDoc)=>{

      tree.select(['selectedCollection', 'items']).push(newDoc);
      var collection = tree.select(['collections', { name: doc.collection }]);
      collection.set('count', collection.get('count') + 1);
      core.action('mongo.setDocument', newDoc);

    }).catch((err)=>{
      core.action('mongo.error', err)
    });
  };
});

core.Action('mongo.updateDocument', [
  'mongo.socket',
  'mongo.tree',
], (socket, tree)=>{
  return (data, done)=>{ // data =  { collection: 'cats', document: { .. } }
    socket.action('updateDocument', data).then((res)=>{

      if(!res.ok) return done(res);
      tree.select(['selectedCollection', 'items', { _id: data.document._id }]).set(data.document);
      // collection.set('count', collection.get('count') + 1);
      // core.action('mongo.setDocument', newDoc);

    }).catch((err)=>{
      core.action('mongo.error', err)
    });
  };
});
