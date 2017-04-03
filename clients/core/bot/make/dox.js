var fs = require("fs");
var path = require('path');
var dox = require('dox');

var exclude = [/node_modules/, /docs/, /utils/, /bot/, /core_plugins/, /\.md/];
var include = [/.js$/]
function read(pathArray, done){
    var p = path.join.apply(path, pathArray);
    
    var stat = fs.statSync(p);
    if(stat.isDirectory()){
        var files = fs.readdirSync(p);
        var index = 0;
        var length = files.length;
        var result = {};
        files.map(function(file){
            var newPathArray = pathArray.concat([file]);
            var match = false;
            if(file.indexOf('.') === 0){
                length--;
                    // console.log('exclude', p, exclude[i]);
                    if(index >= length){ done(null, result); }
                    return;
            }
            var p = path.join.apply(path, newPathArray);
            for(var i = 0; i < exclude.length; i++){
                if(p.match(exclude[i])) {
                    length--;
                    if(index >= length){ done(null, result); }
                    return;
                }
            }
            for(var k = 0; k < include.length; k++){
                if(p.match(include[k])) {
                    match = true
                }                
            }
            if(!match){
                length--;
                if(index >= length){ done(null, result); }
                return;
            }
            read(newPathArray, function(err, data){
                if(err) throw err;
                result[file] = data;
                index++;
                // console.log('t', newPathArray, index, length);
                
                if(index >= length){ done(null, result); }
            });
        })
    }
    else{
        return done(null, fs.readFileSync(p, 'utf8'));
    }
}


function getDox(object){
    var index = 0;
    var length = Object.keys(object).length;
    for(var m in object){
        if(typeof object[m] === 'string'){
            object[m] = dox.parseComments(object[m]);
        }
        else{
            object[m] = getDox(object[m]);
        }
    }
    return object;
}

module.exports = function(path){
    var here = process.cwd();
    read([here], function(err, data){
        var docs = getDox(data);
        var out = 'dox.json';
        fs.writeFileSync(out, JSON.stringify(docs, null, 4));
        console.log(colors.green(`> ${ out }`));

    });
    
};