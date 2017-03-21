var colors = require('colors');
var request = require('request');

var utils = require('./utils.js');

var defaultOptions = {
    loopback: 'localhost:4000',

};


module.exports = function (_options) {

    var options = Object.assign({}, defaultOptions, options);

    function log() {
        if (options.log) {
            console.log.apply(console, arguments);
        }
    }

    function handleError(err) {
        console.log(err);
    }

    return function (req, res, next) {

        var headers = req.headers;
        if (headers['x-cache-forward']) {
            return next()
        }
        if (req.method === 'POST' || req.method === 'PUT') {
            utils.getRequestBody(req, function(body){

            });
        }
        else{
            
        }

    }

};