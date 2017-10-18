
var fs = require('fs');
var { join } = require('path');

// load all plugins in the 'plugins' folder.
var names = fs.readdirSync( join(__dirname, 'plugins') );

var plugins = names.map(name => {
    var path = join(__dirname, 'plugins', name);
    return require(path);
});

core.plugin(plugins);

// an array of the cli arguments that you've passed after `core.bot`.
var cliArgs = core.bot.arguments

// find the command in the local 'commands' folder and run it.
core.bot.exec(
    cliArgs
);