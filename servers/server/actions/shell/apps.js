
var fs = require('fs');
var path = require('path');
var async = require('async');
var url = require('url');

var projectFileName = 'webpack.config.js';

function getViewPath(viewPath){
  var viewPath = url.parse(viewPath);
  return path.resolve(process.cwd(), './clients/apps' + viewPath.pathname);
}

function readDir(url, cb){
  var result = {};
  fs.readdir(url, function(err, files){
    if(err) return cb(err);
    if(files.indexOf(projectFileName) > -1) return cb(null, null);  // if this is a project folder return null
    async.parallel(files.map(function(file){   // for all file in this dir
      var filePath = path.join(url, file);
      return function(callback){
        fs.stat(filePath, function(err, stat){
          if(stat.isDirectory()){   // a directory that is not a project folder
            return readDir(filePath, function(err, obj){
              result[file] = obj;
              callback(err, null)
            });  // if it is a directory, recurse
          }
          callback(null, null);   // just a file
        });
      };
    }), function(err, results){
      cb(err, result);
    });
  });
}
module.exports = {
  getApps(action){
    readDir(path.resolve(process.cwd(), 'clients/apps'), function(err, apps){
      if(err) return action.fail(err);
      action.done(apps);
    });
  },
  getReadMe(action){
    var absolutePath = path.join(getViewPath(action.request.body.view), 'component', 'README.md');
    fs.readFile(absolutePath, { encoding: 'utf8'}, function(err, data){
      if(err) return action.fail(err);
      action.done(data);
    });
  },
  setReadMe(action){
    var absolutePath = path.join(getViewPath(action.request.body.view), 'component', 'README.md');
    fs.writeFile(absolutePath, action.request.body.markdown, function(err, data){
      if(err) return action.fail(err);
      action.done(data);
    });
  }
};
