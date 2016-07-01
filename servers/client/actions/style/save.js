var fs = require('fs');
var path = require('path');
module.exports = (action)=>{
  action.ensure({
    json: 'object'
  }, (json)=>{
    fs.writeFile(path.resolve(process.cwd(), './servers/style.json'), JSON.stringify(json, null, 4), (err)=>{
      if(err) return action.fail(err);
      action.done();
    });
  });
};
