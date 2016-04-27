
var child = require('child_process');
var path = require('path');
var url = require('url');

function getViewPath(viewPath){
  viewPath = url.parse(viewPath);
  return path.resolve(process.cwd(), './clients/views' + viewPath.pathname);
}

module.exports = {
  open(action){
    action.ensure({
      path: 'string'
    }, function(path){
      if(!core.config.app.editor){
        return action.fail(`please specify an editor on the server's config.app`);
      }
      var viewPath = getViewPath(path);
      child.exec(`${core.config.app.editor} ${viewPath}`, (err)=>{
        if(err) return action.fail(err);
        action.done();
      });
    })

  }
};
