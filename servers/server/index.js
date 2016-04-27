
var Core = require('../Core');
var open = require('open')
var requireDir = require('require-dir');
var httpProxy = require('http-proxy');
var url = require('url');
var request = require('request');
var path = require('path');
var fs = require('fs');
var async = require('async');
var express = require('express');
var morgan = require('morgan');
var request = require('request');
var bunyan = require('bunyan');

var config = requireDir('./config');
config.master = require('../../config.json');
var proxy = httpProxy.createProxyServer();

var httpProxyResLogSerializer = function res(res) {
    if (!res || !res.statusCode)
        return res;
    return {
        statusCode: res.statusCode,
        header: res.headers
    }
};
var log = bunyan.createLogger({
    name: 'WebintProxy',
    serializers: {
    	req: bunyan.stdSerializers.req,
    	err: bunyan.stdSerializers.err,
    	res: httpProxyResLogSerializer

    },
    streams: [{
    	type: 'rotating-file',
    	period: '1d',   // daily rotation
        count: 15,        // keep 3 back copies
        path: "logs/webint-proxy.log"
        // `type: 'file'` is implied
    }]
});

var resourcesPath = path.join(__dirname, 'resources');
var globalResourcesPath = path.resolve(__dirname, '../resources');

var proxyLogger;
var logger = morgan('combined')
function proxyRequest(req, res){
  proxy.web(req, res, { target: config.master.master }, function(e){
    proxyLogger.error(e);
  });
}

function proxyMapsRequest(req, res){
  proxy.web(req, res, { target: config.master.maps }, function(e){
    proxyLogger.error(e);
  });
}

var middlewares = {
  "/proxy/maps"(req, res) {
    proxyMapsRequest(req, res);
    // logger(req, res, proxyRequest)
  },
  "/proxy"(req, res) {
    proxyRequest(req, res);
    // logger(req, res, proxyRequest)
  }
};
// var schemas = requireDir('./schemas');
var core = Core(config, middlewares);
proxyLogger = core.loggers.proxy;


proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyLogger.debug(`starting a proxy request to ${proxyReq.path}`);
  if(req.query.authToken) {
      proxyReq.setHeader('AuthorizationToken', req.query.authToken);
      proxyLogger.debug("moving AuthorizationToken", req.query.authToken, "from query to header");
      req.query.authToken = undefined;
  }
});

proxy.on('proxyRes', function(proxyRes, req, res, options) {
  proxyLogger.debug(`returning a proxy request to ${proxyRes.req.path}`);
  if(proxyRes.statusCode > 399 && proxyRes.statusCode < 500)
  	log.warn({ res: proxyRes, req: req }, 'response');
  else if(proxyRes.statusCode > 499)
  	log.fatal({ res: proxyRes, req: req }, 'response');
  else
  	log.info({ res: proxyRes, req: req }, 'response');
});

proxy.on('error', function (err, req, res) {
  log.error({ err: err, req: req, res: res }, 'error');
});

core.actions.load(requireDir('./actions', {recurse: true}));
console.log(globalResourcesPath);
core.app.use('/resources', express.static(resourcesPath), express.static(globalResourcesPath));

if(process.argv.indexOf('-o') > -1){
  open(`${config.app.domain}:${config.app.port}`);
}
