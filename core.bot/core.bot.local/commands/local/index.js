
var path = require('path');

var here = process.cwd();

module.exports = function local (args) {

    var folder = core.read(core.bot.path);
    var fPath = path.join(here, 'core.bot.local');
    core.write(fPath, folder);
    console.log(colors.green(`=> ${ fPath }`))
    process.exit();
    
};