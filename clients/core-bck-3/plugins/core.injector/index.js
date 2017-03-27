var Injector = require('./Injector.js');


module.exports = {
    name: 'core.injector',
    dependecies: [
        'core.getDefinitionObject',
        'core.build'
    ],
    types: [{
        name: 'module',
        schema: {
            name: {
                $_type: 'string',
                description: 'The name of the module.',
                isRequired: true
            },
            dependencies: {
                $_type: 'array',
                ofType: 'module',
                description: `locally defined dependencies.`,
                items: []
            },
            get: {
                $_type: 'function',
                source: '() => {  }',
                compiled: 'function(){  }'
            }
        },
        build(definition) {
            var {
                name,
                dependencies,
                get,
                value
            } = definition;
            if ('value' in definition) {
                this.injector.load(name, value);
            } else {
                this.injector.load(name, dependencies, get.bind(this));
            }
        }
    }],
    extend: {
        Module(name, dependencies, get) {
            var definition = this.getDefinitionObject(name, dependencies, get, 'module');
            return this.build(definition);
        },
    },
    init(plugin, done) {
        var core = this;
        var injector = Injector();
        var definition = plugin;
        core.injector = injector;
        core.require = injector.require;
        core.loadContext = injector.loadContext;
        core.modules = injector.modules;
        done(injector);
    }
};