
var fs = require('fs');
var path = require('path');
var here = process.cwd();

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = function(args){

    var name = args.shift();
    deleteFolderRecursive(path.join(here, 'plugins', name));
    console.log(colors.green(`removed plugin ${ name }.`));

};