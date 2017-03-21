var colors = require('colors');
var http = require('http');

var utils = require('./utils.js');
var memory = require('./storage/memory.js');

var defaultOptions = {
    target: 'http://localhost:4000',
    storage: memory,
    log: false
};



module.exports = function (_options) {

    var options = Object.assign({}, defaultOptions, _options);

    function log() {
        if (options.log) {
            var args = [].slice.call(arguments);
            args.unshift('Cache'.cyan);
            console.log.apply(console, args);
        }
    }

    function handleError(err) {
        console.log('Cache - Error'.red, error);
    }

    /* forward a request and cache it's response using a hash key */

    function forward(req, res, next){

        log(req.method.green, req.originalUrl.yellow);

        utils.getRequestBody(req, function (body) {
            
            var reqOptions = utils.copyRequestOptions(req, options.target);
            var key = utils.makeRequestKey(reqOptions, body);
            reqOptions.headers['x-cache-forward'] = '1';

            var newReq = utils.makeHttpRequest(reqOptions, function(err, response, body){

                if(err) return handleError(err);
                res.writeHead(response.statusCode, response.headers);
                res.write(body);
                res.end();
                if(true){  // flags for caching?
                    options.storage.set(key, {
                        body: body,
                        meta: {
                            statusCode : response.statusCode,
                            headers : response.headers
                        }
                    });
                }

            });

            newReq.on('error', handleError);
            if(body) newReq.write(body);
            newReq.end();

        });
    }

    /* get a cached response and send it to the client */

    function getCache(req, res, next){

        log(req.method.magenta, req.originalUrl.yellow);

        utils.getRequestBody(req, function (body) {
            
            var reqOptions = utils.copyRequestOptions(req, options.target);
            var key = utils.makeRequestKey(reqOptions, body);
            var cached = options.storage.get(key);
            if(!cached){
                res.statusCode = 404;
                res.write('no cache found')
                return res.end();
            }
            res.writeHead(cached.meta.statusCode, cached.meta.headers);
            res.write(cached.body);
            res.end();

        });

    }

    
    /* return an express middleware */

    return function (req, res, next) {

        var headers = req.headers;
        if (headers['x-cache-forward']) { return next(); }
        if (headers['x-cache-get']) { return getCache(req, res, next); }
        return forward(req, res, next);

    }

};