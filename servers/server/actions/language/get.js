
var fs = require('fs');
var path = require('path');

module.exports = function(action){
  var language = action.request.body.language;
  if(!language) language = core.config.language;
  if(!language) return action.fail('cannot find language. check server.config');
  fs.readFile(path.resolve(process.cwd(), './servers/server/languages', `./${language}.json`), {encoding: 'utf8'}, (err, data)=>{
    if(err) return action.error(err);
    action.done(data);
  });
};
