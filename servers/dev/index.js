var http = require('http');
var WebSocketServer = require('ws').Server;
var Baobab = require('baobab');
var async = require('async');
var path = require('path');
var fs = require('fs');

var httpServer = http.createServer();
var server = new WebSocketServer({ server: httpServer });

var apps = [];

function App() {

}

function getApp(path) {
  for (var i = 0; i < apps.length; i++) {
    if(apps[i].path === path) return apps[i];
  }
}

function detachSocket(socket) {
  apps.map(function (app) {
    var index = app.clientSockets.indexOf(socket);
    if(index > -1){
      console.log('detaching client socket');
      app.clientSockets.splice(index, 1);
    }
    index = app.devtoolsSockets.indexOf(socket);
    if(index > -1){
      console.log('detaching devtools socket');
      app.devtoolsSockets.splice(index, 1);
    }
  })
}

function addApp(appPath, cb) {

  var objectPath = path.join(process.cwd(), 'clients', 'apps', appPath, 'coreObject.js');
  var tree = new Baobab();
  var lastUpdate = 0;
  var lastSave = 0;

  function save() {
    var json = tree.get();
    var jsonString = JSON.stringify(json, null, 4);
    var js = `\nwindow.__coreObject = ${jsonString};`;
    fs.writeFile(objectPath, js, function (err) {
      if(err) return console.log(err);
      console.log(`saved ${appPath}`);
    });
  }

  function load(cb) {
    fs.readFile(objectPath, { encoding: 'utf8'}, function (err, str) {
      if(err) return cb(err);
      var jsonString = str.slice(str.indexOf('{'), str.lastIndexOf('}') + 1);
      var json = JSON.parse(jsonString);
      tree.set(json);
      console.log(`loading app ${appPath}`);
      cb(null, json);
    });
  }



  tree.on('update', function () {
    lastUpdate = new Date().getTime();
  });

  var interval = setInterval(function () {
    if(lastSave > lastUpdate) return;
    var now = new Date().getTime();
    if((now - lastUpdate) > 1000){
      save();
      lastSave = now;
    }
  }, 1000)

  var app = {
    tree: tree,
    path: appPath,
    objectPath: objectPath,
    save: save,
    set(dataPath, value){
      this.tree.set(dataPath, value);
      this.clientSockets.map(function (socket) {
        socket.action('set', { path: dataPath, value: value });
      });
      this.devtoolsSockets.map(function (socket) {
        socket.action('update', { path: dataPath, value: value });
      });
    },
    get(cb){  // get from disc
      load(cb);
    },
    clientSockets: [],
    devtoolsSockets: [],
    registerClient(socket, done){
      if(this.clientSockets.indexOf(socket) === -1){
        this.clientSockets.push(socket);
      }
      console.log(`registered client to ${appPath}`);
      done();
    },
    registerDevtools(socket, done){
      detachSocket(socket, done);
      this.devtoolsSockets.push(socket);
      console.log(`registered client to ${appPath}`);
      done(null, tree.get());
    }
  };

  apps.push(app);

  load(err => cb(err, app));

  return app;
}


var actions = {
  set(data, done){
    var appPath = data.appPath;
    var path = data.path;
    var value = data.value;
    console.log(appPath, path, value);
    if(!appPath){
      return done(`appPath parameter is missing`);
    }
    if(!path){
      return done(`path parameter is missing`);
    }
    if(!value){
      return done(`value parameter is missing`);
    }
    var app = getApp(appPath);
    if(!app){
      return done(`cannot find app ${appPath}`);
    }
    app.set(path, value);
    done();
  },
  get(data, done){
    var appPath = data.appPath;
    var path = data.path;  // may be undefined
    if(!appPath){
      return done(`appPath parameter is missing`);
    }
    var app = getApp(appPath);
    if(!app){
      return done(`cannot find app ${appPath}`);
    }
    if(!path || !path[0]){
      return app.get(done);
    }
    done(null, app.tree.get(path));
  },
  getApps(data, done){
    var paths = apps.map(function (app) {
      return app.path;
    });
    done(null, paths);
  },
  registerClient(data, done, socket){
    var appPath = data.appPath;
    if(!appPath){
      return done('appPath parameter is missing');
    }
    var app = getApp(appPath);
    if(!app){
      addApp(appPath, function (err, app) {
        app.registerClient(socket, done);
      });
    }
    else{
      app.registerClient(socket, done);
    }
  },
  registerDevtools(){
    var appPath = data.appPath;
    if(!appPath){
      return done('appPath parameter is missing');
    }
    var app = getApp(appPath);
    if(!app){
      addApp(appPath, function (err, app) {
        app.registerDevtools(socket);
      });
    }
  }
};

server.on('connection', function (socket) {           // fired for every incoming socket connection.

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
      }, socket);
    } catch (e) {
      return console.error(e);
    }
  });

  socket.on('close', function () {
    detachSocket(socket);
  });
});

httpServer.listen(8001, function(){
  console.log('➜  dev socket at port 8001');
});
