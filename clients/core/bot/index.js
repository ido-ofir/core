var fs = require('fs');
var path = require('path');

var processArgs = process.argv.slice(2);
var here = __dirname;

var colors = global.colors = {
    red(s){ return `\u001b[31m${ s }\u001b[39m`; },
    green(s){ return `\u001b[32m${ s }\u001b[39m`; },
    yellow(s){ return `\u001b[33m${ s }\u001b[39m`; }
};

function search(dir, args) {

    
    var stats, name = args.shift();
    var newDir = path.join(dir, name);
    try {
        stats = fs.statSync(newDir);
        search(newDir, args);
    } catch (err) {
        var fileName = path.join(dir, `${name}.js`);
        try {
            var f = require(fileName);
            if(!(typeof f === 'function')){
                console.log(colors.yellow(`command '${ name }' is not a function.`));
            }
            else{
                f(args);
            }
        } catch (err) {
            console.error(err);
            
            process.exit();
        }
    }
}

search(here, processArgs);



/*



 */