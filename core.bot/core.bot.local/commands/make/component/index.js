var fs = require('fs');
var path = require('path');


module.exports = function (args) {

    var here = process.cwd();
    var name = args.shift();
    try {

        core.parseFolder(path.join(__dirname, 'template'), path.join(here, name), { name: name });
        console.log(colors.green(`created component ${ name }.`));
        process.exit();

    } catch (err) {

        if (err.errno === -17) {
            throw colors.red(`component '${ name }' already exists.`);
        } else {
            throw err;
        }

    }

};