var fs = require('fs');
var path = require('path');
var async = require('async');

module.exports = function (action) {
  action.ensure({
    'path': 'array'
  }, (pathToDir)=>{
    var p = [process.cwd()].concat(pathToDir);
    var dir = path.join.apply(path, p);
    console.dir(dir)
    fs.readdir(dir, (err, data)=>{
      if(err) {
        console.log('a');
        console.dir(err)
        return action.fail(err);
      }
      async.map(data.map((item)=>{ return path.join(dir, item); }), fs.stat, (err, results)=>{
        if(err) {
          console.log('b');
          console.dir(err)
          return action.fail(err);
        }

        action.done(data.map((item, index)=>{
          return { name: item, type: (results[index].isFile() ? 'file' : 'folder')};
        }));
      });

    });
  });
}
