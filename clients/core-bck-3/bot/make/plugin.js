var fs = require('fs');
var path = require('path');
var here = process.cwd();

module.exports = function (args) {
    var name = args.shift();
    try {
        fs.mkdirSync(path.join(here, 'plugins', name));
        fs.writeFileSync(path.join(here, 'plugins', name, `index.js`),
            `
module.exports = {
    name: '${ name }',
    init(definition, done){
        
        var core = this;

        done({
            go(){ 
                alert('${ name } is ready to go'); 
            }
        });

    }
};`
        );
        console.log(colors.green(`created plugin ${ name }.`));

    } catch (err) {

        if (err.errno === -17) {
            throw colors.red(`plugin '${ name }' already exists.`);
        } else {
            throw err;
        }

    }

};