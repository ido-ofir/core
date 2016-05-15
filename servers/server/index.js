
var Core = require('../core');
var requireDir = require('require-dir');
var path = require('path');
var express = require('express');


var config = requireDir('../../config');

var resourcesPath = path.resolve(__dirname, '../resources');

var core = Core(config.server);

core.actions.load(requireDir('./actions', {recurse: true}));

core.app.use('/resources', express.static(resourcesPath));
