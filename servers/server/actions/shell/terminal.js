
var child = require('child_process');
var path = require('path');
var url = require('url');

function getViewPath(viewPath){
  viewPath = url.parse(viewPath);
  return path.resolve(process.cwd(), './clients/views' + viewPath.pathname);
}

module.exports = {
  open(action){
    console.dir(action.request.body);
    action.ensure({
      path: 'string'
    }, (path)=>{

      if(!core.config.app.terminal){
        return action.fail(`please specify a terminal app on the server's config.app`);
      }
      var viewPath = getViewPath(path);
      console.log(`${core.config.app.terminal} ${viewPath}`);
      child.exec(`${core.config.app.terminal} ${viewPath}`, (err)=>{
        if(err) return action.fail(err);
        action.done();
      });
    });
  }
};
