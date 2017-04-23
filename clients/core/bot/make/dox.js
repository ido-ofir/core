var fs = require("fs");
var path = require('path');
var dox = require('dox');

var exclude = [/node_modules/, /router\/out/];
var include = [/.js/];
var out = 'dox.json';
var makeLog = false;

function log(){
    if(!makeLog) return;
    console.log.apply(console, [].slice.call(arguments))
}

function read(pathArray){

    var p = path.join.apply(path, pathArray);
    log(colors.yellow(`reading ${ p }`));
    
    var stat = fs.statSync(p);
    if(stat.isDirectory()){

        log(`is directory`);
        var files = fs.readdirSync(p);
        var result = {};
        files.map(function(file){
            var newPathArray = pathArray.concat([file]);
            var np = path.join.apply(path, newPathArray);
            // log(`matching`, np);
            // ignore files or folders that start with a '.'
            if(file.indexOf('.') === 0){ return; }
            for(var i = 0; i < exclude.length; i++){
                // log(`excluded`, np);
                if(np.match(exclude[i])) { return; }
            }
            var data = read(newPathArray);
            if(data){
                // log(colors.red(`writing`), colors.red(np))
                result[file] = data;
            }
        });
        log(colors.green(`finished`), colors.green(p))
        return result;
    }
    else{
        for(var k = 0; k < include.length; k++){
            if(p.match(include[k])) {
                return fs.readFileSync(p, 'utf8');
            }                
        }
        return null;
    }
}


function getDox(object){
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

function getDoxFlat(object, pathArray, result){
    var pArray;
    for(var m in object){
        pArray = pathArray.concat([m]);
        if(typeof object[m] === 'string'){
            var comments = dox.parseComments(object[m]);
            comments.map(function(c){
                c.fileName = pArray.join('/')
                result.push(c);
            });
        }
        else{
            getDoxFlat(object[m], pArray, result);
        }
    }
    return result;
}

module.exports = function(args){
    var here = process.cwd();
    var source = path.join(here, 'source');
    var data = read([source]);
    var docs = getDoxFlat(data, ['source'], []);    
    fs.writeFileSync(out, JSON.stringify(docs, null, 4));
    console.log(colors.green(`> ${ out }`));
    
};