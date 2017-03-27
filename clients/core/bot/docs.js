

module.exports = function(){
    require('child_process').exec('jsdoc . -t ./node_modules/ink-docstrap/template -R ./README.md');
};