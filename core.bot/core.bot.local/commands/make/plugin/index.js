var fs = require('fs');
var path = require('path');


module.exports = function (args) {

    var here = process.cwd();
    var name = args.shift();
    var folder = args.shift() || '';
    try {

        core.parseFolder(path.join(__dirname, 'template'), path.join(here, folder, name), { name: name });
        console.log(colors.green(`created plugin ${ name }.`));
        process.exit();

    } catch (err) {

        if (err.errno === -17) {
            throw colors.red(`plugin '${ name }' already exists.`);
        } else {
            throw err;
        }

    }

};