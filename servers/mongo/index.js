var http = require('http');
var WebSocketServer = require('ws').Server;
var mongo = require('mongodb');
var async = require('async');

var httpServer = http.createServer();
var server = new WebSocketServer({ server: httpServer })

mongo.MongoClient.connect('mongodb://localhost/test', (err, db)=>{
  if(err) return console.error(err);

  db.createCollection('models', (err, models)=>{

    if(err) return console.error(err);

    var actions = {
      listCollections(data, done){
        db.listCollections().toArray((err, collections)=> {
          async.map(collections, (collection, cb)=>{
            db.collection(collection.name).count((err, count)=>{
              cb(err, {
                name: collection.name,
                count: count
              });
            })
          }, done);
        });
      },
      addCollection(name, done){
        db.createCollection(name, (err, item)=>{
          done(err);
        });
      },
      removeCollection(name, done){
        db.dropCollection(name, (err, circular)=>{
          done(err);
        });
      },
      getCollection(name, done){
        db.collection(name).find().toArray(done);
      },
      getDocument(data, done){
        db.collection(data.collection).findOne({_id: mongo.ObjectID(data.id)}, done);
      },
      updateDocument(data, done){
        var doc = {};
        for(var m in data.document){
          if(m !== '_id'){
            doc[m] = data.document[m];
          }
        }
        db.collection(data.collection).update({_id: mongo.ObjectID(data.document._id)}, doc, done);
      },
      createDocument(data, done){
        db.collection(data.collection).insert(data.document, (err, data)=>{
          done(err, data && data.ops && data.ops[0]);
        });
      },
      removeDocument(data, done){
        db.collection(data.collection).remove({_id: mongo.ObjectID(data.id)}, done);
      }
    };

    server.on('connection', function (socket) {           // fired for every incoming socket connection.
      socket.action = function(type, data){
        socket.send(JSON.stringify({type: type, data: data}));
      }

      socket.on('message', function(msg){
        var json = JSON.parse(msg);
        if(actions[json.type]){
          actions[json.type](json.data, function(err, res){
            // console.log(err);
            // console.log(res);
            socket.send(JSON.stringify({id: json.id, error: err, data: res}));
          },socket)
        }
        else{
          console.error(`cannot find action ${json.type}`);
        }
      });
    });

    httpServer.listen(3000, function(){
      console.log('➜  mongo socket at port 3000');
    });
  });



});





// var test = new SchemaModel({
//   name: 'tests5',
//   model: { name: 'string' }
// });
// test.markModified('model');
// test.save();
