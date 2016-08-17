
var q = require('q');
var core = require('core');

core.Module('socket', [], function () {

  var socket = core.Socket({
    url: 'ws://178.62.222.57:8001'
  });

  return socket;

});
