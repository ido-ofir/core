var Request = require('./request.js');
var sa = require('superagent');

module.exports = function(config, options){
  var noFail = options ? options.fail : undefined;
  var request = Request(config, options);
  request.login = function(loginData, success, fail) {
    request.post(`/login`, loginData, success, fail).exec();
  };
  request.register = function(regData, success, fail) {
    request.post(`/register`, regData, success, fail).exec();
  };
  request.logout = function(success, fail) {
    request.delete(`/logout`, {}, success, fail).exec();
  };
  request.action = function(path, data, success, fail) {
    request.post('/actions/' + path.join('/'), data, success, fail).exec();
  };
  return request;
}
