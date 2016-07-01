
var Core = require('../core');
var requireDir = require('require-dir');
var path = require('path');
var express = require('express');
var proxy = require('proxy-middleware');
var webpack = proxy('http://localhost:8888');
var appName = process.argv[3] || 'app';

var config = requireDir('../../config');

var resourcesPath = path.resolve(__dirname, '../resources');

var core = Core(config.server);

core.actions.load(requireDir('./actions', {recurse: true}));

core.app.use('/resources', express.static(resourcesPath));
core.app.use(`/${appName}/build`, function(req, res, next){
  console.log('ok');
  webpack(req, res, next);
});
