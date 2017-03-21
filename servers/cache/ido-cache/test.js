
var express = require('express');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var app = express();
var cache = require('./index.js');

app.use(cache.middleware('5 minutes'))

app.use(function(req, res, next){
    proxy.web(req, res, { target: 'http://mynetpetahtikva.co.il/' }, function(err){
        console.log(err);
    });
});

app.listen(4000);

