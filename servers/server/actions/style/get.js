var fs = require('fs');
var path = require('path');
module.exports = (action)=>{
  fs.readFile(path.resolve(process.cwd(), './servers/style.json'), {encoding: 'utf8'}, (err, json)=>{
    if(err) return action.error(err);
    try {
      json = JSON.parse(json);
      action.done(json);
    } catch (e) {
      console.error(e);
      action.error(e);
    }
  });
};
