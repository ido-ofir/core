var fs = require('fs');
var path = require('path');

// load config.json from the root and read it's 'client' section as an object,
// then find the correct language and attach it to that object.
// returns the theme and the complete language for the client.

var configPath = path.resolve(process.cwd(), `./config/client.json`);


module.exports = function(action){

  fs.readFile(configPath, {encoding: 'utf8'}, (err, data)=>{
    if(err) return action.error(err);
    var config = JSON.parse(data);
    var language = config.language;
    var theme = config.theme;
    fs.readFile(path.resolve(process.cwd(), `./servers/server/languages/${language}.json`), {encoding: 'utf8'}, (err, data)=>{
      if(err) return action.error(err);
      config.language = JSON.parse(data);
      action.done(config);
    });
  });

};
