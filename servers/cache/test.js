
var express = require('express');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var app = express();
// var cache = require('./index.js');
var cache = require('./ido-cache');

app.use(cache({
    log: true,
    target: 'http://localhost:4000/'
}))

app.use(function(req, res, next){
    proxy.web(req, res, { target: 'http://localhost:5000/' }, function(err){
        console.log(err);
    });
});

app.listen(4000);



