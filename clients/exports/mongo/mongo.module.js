var core = require('core');

var mongo = require('./MongoSocket.js')();

core.Module('mongo.socket', mongo);

// core.Action('mongo.listCollections', (data, done)=>{
//   mongo.action('listCollections', data, done);
// });
// core.Action('mongo.addCollection', (name, done)=>{
//   mongo.action('addCollection', name, done);
// });
// core.Action('mongo.removeCollection', (name, done)=>{
//   mongo.action('removeCollection', name, done);
// });
// core.Action('mongo.getCollection', (name, done)=>{
//   mongo.action('getCollection', name, done);
// });
// core.Action('mongo.getDocument', (data, done)=>{
//   mongo.action('getDocument', data, done);
// });
// core.Action('mongo.updateDocument', (data, done)=>{
//   mongo.action('updateDocument', data, done);
// });
// core.Action('mongo.createDocument', (data, done)=>{
//   mongo.action('createDocument', data, done);
// });
// core.Action('mongo.removeDocument', (data, done)=>{
//   mongo.action('removeDocument', data, done);
// });
