
var core = require('core');
var counts = {};
var count = 0;
var compile = window.compile = {
  compile(source, name){
    if(!name) name = 'unknown';
    if(!counts[name]) counts[name] = 0;
    counts[name] = counts[name] + 1;
    return Babel.transform(source, {
      presets: ['react','es2015', 'stage-0'],
      sourceMaps: 'inline',
      sourceFileName: `${name}(${counts[name]})`,
    });
  },
  asReturnFunction(source, name){
    var code = `
(function(){
${ source }
}())`;
    return compile.compile(code, name).code;
  },
  actions(source, name){
    return compile.compile(source, name).code;
  }
};
module.exports = {
  $_type: 'module',
  name: 'compile',
  value: compile
};
