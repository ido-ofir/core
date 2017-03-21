
var express = require('express');
var app = express();

app.use('/test1', function(req, res, next){
    res.end('test1 ok');
});

app.use('/test2', function(req, res, next){
    res.end('test2 ok');
});

app.listen(5000);
