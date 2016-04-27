var fs = require('fs');
var path = require('path');

// load config.json from the root and read it's 'client' section as an object,
// then find the correct language and attach it to that object.
// returns the theme and the complete language for the client.

var masterConfigPath = path.resolve(process.cwd(), `./config.json`);


module.exports = function(action){

  fs.readFile(masterConfigPath, {encoding: 'utf8'}, (err, data)=>{
    if(err) return action.error(err);
    var masterConfig = JSON.parse(data);
    var language = masterConfig.client.language;
    var theme = masterConfig.client.theme;
    fs.readFile(path.resolve(process.cwd(), './servers/server/languages', `./${language}.json`), {encoding: 'utf8'}, (err, data)=>{
      if(err) return action.error(err);
      masterConfig.client.language = JSON.parse(data);
      action.done(masterConfig.client);
    });
  });

};
