
var fs = require('fs');

var Middleware = require('./Middleware.js');
var Cache = require('./Cache.js');
var Emitter = require('./Emitter.js');
var http = require('./http.js');

var userImagesFolder = 'resources/images';

function merge(a, b){
  for(var m in b){
    a[m] = b[m];
  }
  return a;
}

function parse(data){
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
}

function slicePath(path){
  if(typeof path !== 'string') return false;
  path = path.split('/');
  if(path.length > 1) return path;
  if(path.length < 1) return false;
  path = path[0].split('.');
  if(path.length < 1) return false;
  return path;
}

function forEach(array, func, done){   // runs 'func' for each item in 'array'. done is called when func called next() for each item in array.
  if(!array.length) return done();
  var i = -1;
  function run(){
    i++;
    func(array[i], i, (array[i + 1] ? run : done));     // func(item, index, next).
  }
  run();
}

function findById(id, array){
  for (var i = 0; i < array.length; i++) {
    if(array[i] && (array[i].id === id)) return array[i];
  }
}

function saveImage(name, src, success, fail){
  fail = fail || console.error;
  var base64Data = src.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/jpg;base64,/, "");
  var imagePath = path.join(userImagesFolder, name);
  fs.writeFile(path.join(process.cwd(), imagePath), base64Data, 'base64', function(err) {
      if(err) return fail(err);
      success({
        name: name,
        src: imagePath
      });
  });
}





module.exports = {
  merge: merge,
  parse: parse,
  slicePath: slicePath,
  http: http,
  Middleware: Middleware,
  forEach: forEach,
  findById: findById,
  Cache: Cache,
  Emitter: Emitter,
  saveImage: saveImage
};
