var fs = require('fs');
var path = require('path');


module.exports = function (args) {

    var here = process.cwd();
    var name = args.shift();
    try {

        core.parseFolder(path.join(__dirname, 'template'), path.join(here, name), { name: name });
        console.log(colors.green(`created command ${ name }.`));
        process.exit();

    } catch (err) {

        if (err.errno === -17) {
            throw colors.red(`command '${ name }' already exists.`);
        } else {
            throw err;
        }

    }

};