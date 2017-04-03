

var react = require('react');
var baobab = require('baobab');
var q = require('q');

module.exports = {
    name: 'core.imports',
    extend: {
        imports: {
            react: react,
            React: react,
            baobab: baobab,
            q: q
        }
    },
    init(def, next){
        var core = this;
        core.injector.add('imports.react', react);
        core.injector.add('imports.React', react);
        core.injector.add('imports.baobab', baobab);
        core.injector.add('imports.q', q);
        next();
    }
};