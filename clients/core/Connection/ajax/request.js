
var sa = require('superagent');
var accessTokenHeader = 'AuthorizationToken';
var accessToken = localStorage.getItem('koko.AuthorizationToken');
if(accessToken === 'null') accessToken = null;

function setAccessToken(token){
  // console.log('setting access token', token);
  accessToken = token;
  localStorage.setItem('koko.AuthorizationToken', token);
}

function noSuccess(data){
  console.debug('%O', 'ajax success:', data);
}
function noFail(err){
  if(!err) return console.error(`empty http error message`);
  if(err.type){
    console.error(`ajax fail: ${err.type}:`);
    console.dir(err.data);
  }
  else{
    console.log('ajax fail:');
    console.dir(err);
  }
}
function normalize(url){
  if(!url) return '';
  var schema = url.match('http://') || url.match('https://');
  if(!schema) return `http://${url}`;
  return url;
}

function getArguments(url, params, success, fail) {  // orginazes the arguments, allows params to be optional
  if(params instanceof Function){
    fail = success;
    success = params;
    params = null;
  }
  return { url: url, params: params, success: success, fail: fail };
}

var request = function(config, options) {
  var serverIp = (config && config.domain) ? `${config.domain}:${config.port || 80}` : '';
  serverIp = normalize(serverIp);

  function runFailSequence(res, fail){
    var fallback = ()=>{
      if(options.fail) options.fail(res);
      else noFail(res)
    }
    if(fail){
      fail(res, fallback);
    }
    else fallback();
  }

  function Request(req, success, fail, timeout) {
    if(accessToken) req.set(accessTokenHeader, accessToken);
    if(!success) success = noSuccess;
    var canceled = false;
    var returned = false;
    req.set('Accept', 'application/json');
    // req.set('Content-Type', 'application/json');
    req.withCredentials();
    req.exec = function(){
      if(timeout){   // no response fallback

        setTimeout(function(){
          if(returned) return;
          canceled = true;
          options.fail('connection error');
        }, timeout);
      }
      req.end(function(err, res) {
          // Handling response HTTP error
          returned = true;
          if(err) return runFailSequence(err, fail);
          if(!res || res.error) return runFailSequence(res, fail);


          // Seek response body variable
          var response = res.body || {};
          if(!res.body && res.text) response = res.text;

          // Handling error from API
          if (response.error) {
            return runFailSequence(res, fail);
          }
          if (response.success === false) {
            return runFailSequence(res, fail);
          }

           // Set access token to local storage
          if(response[accessTokenHeader]) setAccessToken(response[accessTokenHeader]);
          else if(response.data && response.data[accessTokenHeader]) setAccessToken(response.data[accessTokenHeader]);
          else if(res.headers[accessTokenHeader]) setAccessToken(res.headers[accessTokenHeader]);

          // No content handler
          if(res.status === 204) return success({}, res.headers, res.status);

          // Handling Success data from API
          if (response.success === true) {
            return success(response.data, res.headers, res.status);
          }
          return success(response, res.headers, res.status);
      });
    };
    return req;
  }

  return {
    get(url, params, success, fail, timeout) {

      var req = sa.get(serverIp + url);
      if(params instanceof Function){
        fail = success;
        success = params;
        params = null;
      }
      if(params) req.query(params);

      return Request(req, success, fail, timeout);
    },
    post(url, params, success, fail, timeout) {
      // var args = getArguments(arguments);
      var req = sa.post(serverIp + url).send(params);
      return Request(req, success, fail);
    },
    put(url, params, success, fail) {
      var req = sa.put(serverIp + url).send(params);
      return Request(req, success, fail);
    },
    head(url, params, success, fail, timeout) {

      var req = sa.head(serverIp + url);
      if(params instanceof Function){
        fail = success;
        success = params;
        params = null;
      }
      if(params) req.query(params);

      return Request(req, success, fail, timeout);
    },
    delete(url, params, success, fail, timeout) {
      var req = sa.del(serverIp + url);
      if(params instanceof Function){
        fail = success;
        success = params;
        params = null;
      }
      if(params) req.query(params);
      return Request(req, success, fail, timeout);
    },
    getRaw(url, success, fail){
      var req = sa.get(serverIp + url);
      if(accessToken) req.set(accessTokenHeader, accessToken);
      return req;
    },
    getAccessToken(){
      return accessToken;
    }
  }
};

module.exports = request;
