
var child = require('child_process');
var path = require('path');
var url = require('url');

var webpackProcesses = {};

function getViewPath(viewPath){
  var viewPath = url.parse(viewPath);
  return path.resolve(process.cwd(), './clients/views' + viewPath.pathname);
}

function launchWebpackProcess(absolutePath){
  var spawn = child.spawn('webpack', ['-w'], { cwd: absolutePath });
  spawn.stdout.setEncoding('utf8');
  spawn.stderr.setEncoding('utf8');
  var output = [];
  spawn.stdout.on('data', function (data) {
    var str = data.toString();
    if(str.indexOf('ERROR') > -1) {
      webpackProcesses[absolutePath].error = str;
    }
    else if(str.indexOf('Hash:') > -1) {
      webpackProcesses[absolutePath].error = null;
    }
    core.sockets.fire('webpackOutput', str);
  });

  spawn.stderr.on('data', function (data) {
    output.push(data);
  });

  spawn.on('close', function (code) {
    delete webpackProcesses[absolutePath];
  });
  return {
    child: spawn,
    output: output
  };
}

module.exports = {
  startProcess(action){
    var absolutePath = getViewPath(action.request.body.view);
    if(webpackProcesses[absolutePath]) return action.fail('process is active');
    webpackProcesses[absolutePath] = launchWebpackProcess(absolutePath);
    action.done();
  },
  stopProcess(action){
    var absolutePath = getViewPath(action.request.body.view);
    if(!webpackProcesses[absolutePath]) return action.fail('process is not active');
    webpackProcesses[absolutePath].child.kill();
    action.done();
  },
  isProcessActive(action){
    var absolutePath = getViewPath(action.request.body.view);
    if(webpackProcesses[absolutePath]) {
      return action.done({
        error: webpackProcesses[absolutePath].error
      });
    }
    action.done(false);
  }
}
