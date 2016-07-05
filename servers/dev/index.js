var http = require('http');
var WebSocketServer = require('ws').Server;
var Baobab = require('baobab');
var async = require('async');
var path = require('path');
var fs = require('fs');

var httpServer = http.createServer();
var server = new WebSocketServer({ server: httpServer });

var objectPath = path.join(process.cwd(), 'clients', 'apps', 'app', 'coreObject.js');

var lastUpdate = 0;
var lastSave = 0;

function save() {
  var json = tree.get();
  var jsonString = JSON.stringify(json, null, 4);
  var js = `\nwindow.__coreObject = ${jsonString}`;
  fs.writeFile(objectPath, js, function (err) {
    if(err) return console.log(err);
    console.log('saved');
  });
}

setInterval(function () {
  if(lastSave > lastUpdate) return;
  var now = new Date().getTime();
  if((now - lastUpdate) > 1000){
    save();
    lastSave = now;
  }
}, 1000)

var tree = new Baobab();

tree.on('update', function () {
  lastUpdate = new Date().getTime();
});

fs.readFile(objectPath, { encoding: 'utf8'}, function (err, str) {
  if(err) return console.log(err);
  var jsonString = str.slice(str.indexOf('{'), str.lastIndexOf('}') + 1);
  var json = JSON.parse(jsonString);
  tree.set(json);
});


var actions = {
  set(data, done){
    if(data.path){
      tree.set(data.path, data.value);
      sockets.map(function (socket) {
        socket.action('set', data);
      });
      return done();
    }
    done('path parameter is missing');
  },
  get(data, done){
    if(data.path){
      done(null, tree.get(data.path));
    }
  }
};

var sockets = [];

server.on('connection', function (socket) {           // fired for every incoming socket connection.

  sockets.push(socket);
  socket.action = function(type, data){
    console.log('sending');
    socket.send(JSON.stringify({type: type, data: data}));
  }

  socket.on('message', function(msg){
    try {
      var json = JSON.parse(msg);
      if(!json.type){ return console.error(`json does not have a 'type'`); }
      if(!actions[json.type]){ return console.error(`cannot find action ${json.type}`); }
      actions[json.type](json.data, function(err, res){
        // console.log(err);
        // console.log(res);
        socket.send(JSON.stringify({id: json.id, error: err, data: res}));
      },socket);
    } catch (e) {
      return console.error(e);
    }
  });

  socket.on('close', function () {
    sockets.splice(sockets.indexOf(socket), 1);
  });
});

httpServer.listen(8001, function(){
  console.log('➜  dev socket at port 8001');
});





// var test = new SchemaModel({
//   name: 'tests5',
//   model: { name: 'string' }
// });
// test.markModified('model');
// test.save();
