
module.exports = {
    name: 'core.modules',
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
                value,
                done
            } = definition;
            
            if ('value' in definition) {
                this.injector.load(name, value);
                done && done(value);
            } else {
                this.injector.load(name, dependencies, function(){
                    var value = get.apply(this, arguments);
                    done && done(value);
                });
            }
        }
    }],
    extend: {
        Module(name, dependencies, get, done) {
            var definition = this.getDefinitionObject(name, dependencies, get, 'module', done);
            return this.build(definition);
        },
    }
};