
var winston = require('winston');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "myapp"});
// log levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

module.exports = function Loggers(config){
  var loggers = {};
  function Logger(name, streams){
    return bunyan.createLogger({
      name: name,
      streams: [{
          level: streams.console || 'info',
          stream: process.stdout            // log INFO and above to stdout
        },
        {
          level: streams.file || 'error',
          path: `logs/${name}.log`  // log ERROR and above to a file
        }]
    });
  }
  for(var m in config){
    loggers[m] = Logger(m, config[m]);
  }
  return loggers;
}
