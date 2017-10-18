module.exports = {
    name: 'core.plugins',
    types: [{
        name: 'plugin',
        recursive(def) {
            return def && !!def.recursive;
        },
        schema: {
            name: {
                $_type: 'string',
                value: ''
            },
            dependencies: {
                $_type: 'array',
                items: []
            }
        },
        build(definition) {
            if (!definition) throw new Error('empty plugin definition');
            if (!definition.name) throw new Error('plugin must have a name');
            this.plugin(definition);
            return definition;
        }
    }]
};