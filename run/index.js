
var name = process.argv[2];
// if(name === 'client'){
//   return require('./client.js')(process.argv[3]);
// }
// else{
  if(!name || name.indexOf('-') > -1) name = 'server';
  var server = require(`../servers/${name}`);
// }
// var cloud = require('../servers/cloud')(function(){
//   var server = require(`../servers/${name}`);
// });
