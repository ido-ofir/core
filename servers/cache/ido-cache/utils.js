var url = require('url');
var http = require('http');
var md5 = require('md5');

var utils = {
    typeOf(thing){
      var type = Object.prototype.toString.call(thing);
      return type.substring(8, type.length -1).toLowerCase();
    },
    shallow(obj, depth){
        if(!obj) return obj;
        if(arguments.length === 1) depth = 1;
        var type = utils.typeOf(obj);
        if(!depth) return (type === 'object' || type === 'array') ? type : obj;
        if(type === 'array'){
            return obj.map(function(t){ utils.shallow(t, depth - 1) });
        }
        if(type !== 'object'){
            return obj;
        }
        var shallow = {};
        for(var m in obj){
            type = utils.typeOf(obj[m]);
            shallow[m] = utils.shallow(obj[m], depth -1);
        }
        return shallow;
    },
    getRequestBody(req, done) {
        if(req.body) return req.body;
        var body = '';
        req.on('data', function (data) {
            body += data;
        })
        req.on("end", function () {
            req.body = body;
            done(body);
        });
    },
    copyRequestOptions(req, target) {
        var baseUrl = url.parse(target);
        var path = req.originalUrl || req.url;
        var u = url.parse(path);
        return {
            protocol: u.protocol || baseUrl.protocol,
            hostname: u.hostname || baseUrl.hostname,
            port: u.port || baseUrl.port,
            path: path,
            pathname: path,
            method: req.method,
            auth: u.auth || baseUrl.auth,
            headers: Object.assign({}, req.headers)
        };
    },
    makeHttpRequest(options, callback) {
        var canceled = false;
        var body = [];
        var req = http.request(options, (res) => {
            res.on('data', (chunk) => {
                if (canceled) return;
                body.push(chunk);
            });
            res.on('end', () => {
                if (canceled) return;
                var length = 0;
                body.map(function(chunk){
                    length += chunk.length;
                });
                var content = Buffer.allocUnsafe(length);
                var offset = 0;
                body.map(function(chunk){
                    chunk.copy(content, offset);
                    offset += chunk.length;
                });
                canceled = true;
                callback(null, res, content);
            });
            res.on('error', (err) => {
                if (canceled) return;
                canceled = true;
                res.abort();
                callback(err);
            });
        });

        req.on('error', (err) => {
            canceled = true;
            req.abort();
            callback(err)
        });

        return req;
    },
    makeRequestKey(requestOptions, body){
        var str = url.format(requestOptions);
        var hash = md5(str);
        if(body){
            hash += ('-' + md5(body));
        }
        // console.log(hash.magenta);
        return hash;
    }
};

module.exports = utils;