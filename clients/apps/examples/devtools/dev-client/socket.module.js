
var q = require('q');
var core = require('core');

core.Module('socket', [], function () {
  
  var socket = core.Socket({
    url: 'ws://localhost:8001'
  });

  return socket;

});
