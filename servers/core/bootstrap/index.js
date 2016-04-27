
var Middleware = require('../utils').Middleware;

// var favicon = require('serve-favicon');
// var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
// var multer = require('multer');
// var errorHandler = require('errorhandler');
var cors = require('cors');


function fail(msg){
  this.json({
    success: false,
    data: msg
  });
}

function error(err){
  this.fail({
    error: err
  });
}

function reject(reject){
  this.fail({
    reject: reject
  });
}

function success(data){
  this.json({
    success: true,
    data: data
  });
}

function callback(err, data){
  if(err) this.fail(err);
  else this.success(data);
}

module.exports = function(){
  var bootstrap = Middleware();
  bootstrap.use(methodOverride());
  bootstrap.use(bodyParser.json());
  bootstrap.use(bodyParser.urlencoded({ extended: true }));
  // bootstrap.use(express.logger());
  bootstrap.use(function(req, res, next){
    res.fail = fail.bind(res);
    res.error = error.bind(res);
    res.reject = reject.bind(res);
    res.success = success.bind(res);
    res.callback = callback.bind(res);
    res.header('Access-Control-Allow-Headers' , 'Content-Type');
    next();
  });
  return bootstrap;
};
