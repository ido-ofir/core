
module.exports = {
    name: 'core.modules',
    dependecies: [
        'core.getDefinitionObject',
        'core.build'
    ],
    types: [{
        name: 'module',
        schema: [
            {
                key: 'name',
                type: 'string',
                description: 'The name of the module.',
                required: true
            },{
                key: 'dependencies',
                type: 'array',
                ofType: 'module',
                description: `locally defined dependencies.`,
                items: []
            },{
                key: 'get',
                type: 'function',
                source: '() => {  }',
                compiled: 'function(){  }'
            }
        ],
        build(definition, _super, done) {

            var core = this;
            var {
                name,
                dependencies,
                value,
                get,
            } = definition;
            
            if ('value' in definition) {
                core.injector.load(name, value);
                done && done(value);
                return value;
            } else if(!get){
                throw new Error(`core.modules - a module must define either a 'value' property or a 'get' function.`)
            } else {
                return core.injector.load(name, dependencies || [], function(){
                    value = get.apply(core, arguments);
                    done && done(value);
                    return value;
                });
            }
        }
    }],
    extend: {
        Module(name, dependencies, get, done) {
            var definition = this.getDefinitionObject(name, dependencies, get, 'module', done);
            return this.build(definition, definition.done);
        },
    }
};