var fs = require('fs');
var path = require('path');
var async = require('async');

module.exports = function (action) {
  action.ensure({
    'path': 'array'
  }, (pathToFile)=>{
    var p = [process.cwd()].concat(pathToFile);
    var file = path.join.apply(path, p);
    console.dir(file)
    fs.readFile(file, 'utf8', (err, data)=>{
      if(err) {
        console.dir(err)
        return action.fail(err);
      }
      action.done(data);
    });
  });
}
