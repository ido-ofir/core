

module.exports = function(){
    require('child_process').exec('jsdoc ./core-skeleton.js -t ./node_modules/ink-docstrap/template -R ./README.md -d ./docs -c ./jsdoc.conf.json -r --debug', function(err){
        if(err) throw err;
    });
};