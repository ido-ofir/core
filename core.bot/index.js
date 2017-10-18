var fs = require('fs');
var path = require('path');

var Core = require('core.skeleton');

var processArgs = process.argv.slice(2);
var colors = global.colors = {
    red(s){ return `\u001b[31m${ s }\u001b[39m`; },
    green(s){ return `\u001b[32m${ s }\u001b[39m`; },
    yellow(s){ return `\u001b[33m${ s }\u001b[39m`; },
    purple(s){ return `\u001B[35m${ s }\u001b[39m`; },
    blue(s){ return `\u001B[34m${ s }\u001b[39m`; },
    cyan(s){ return `\u001B[36m${ s }\u001b[39m`; },
    grey(s){ return `\u001b[90m${ s }\u001b[39m`; },
};

// require a js file. if it's a function, run it.
function execFile(filePath, args){

    // console.log(colors.green('exec => '), colors.yellow(filePath));
    
    var f = require(filePath);
    if(typeof f === 'function'){
        f(args);
    }
}

// resolve a file path from an array of arguments, and execute the first match.
function execCommand(dir, args) {
    // console.log('dir', dir);
    // console.log('args', args);
    
    var files, name = args.shift();
    var newDir = path.join(dir, name || '');
    // console.log('newDir', newDir);
    var filePath = newDir;
    try {
        files = fs.readdirSync(newDir);
        // console.log('files', files, name, files.indexOf(`${name}.js`));
        var fileName = `${ args[0] }.js`;
        if(fileName && files.indexOf(fileName) > -1){
            filePath = path.join(newDir, fileName);
            execFile(filePath, args.slice(1));
        }
        else if(files.indexOf('index.js') > -1){
            filePath = path.join(newDir, `index.js`);
            execFile(filePath, args);
        }
        else{
            execCommand(newDir, args);
            
        }
    } catch (err) {
        console.error(err);
        process.exit();
        
    }
}

function getLocalPath(pathArray){
    var fPath = pathArray.concat(['core.bot.local']).join(path.sep);
    try{
        var stat = fs.statSync(fPath);
        if(stat.isDirectory()){
            return fPath;
        }
    }
    catch(err){
        if(!pathArray.pop()) return;
        if(!pathArray.length) return;
        return getLocalPath(pathArray);
    }
}

var globalPath = path.join(__dirname, 'core.bot.local');
var localPath = getLocalPath(process.cwd().split(path.sep));
var botPath = localPath || globalPath;
var commandsPath = path.join(botPath, 'commands');

var bot = {
    path: botPath,
    arguments: processArgs,
    exec: function(args){
        if(!args) return;
        if(!Array.isArray(args)){
            args = [].slice.call(arguments);
        }
        try{
            execCommand(commandsPath, args);
        }
        catch(err){
            console.error(err);
        }
    }
}

var core = global.core = new Core({
    name: 'core.bot',
    extend: {
        bot: bot        
    }
});

require(botPath);