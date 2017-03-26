module.exports = {
    name: 'core.templates',
    dependencies: [
        'core.getDefinitionObject',
        'core.build'
    ],
    extend: {
        templates: {},
        Template(definition, callback) {
            var definition = this.getDefinitionObject(name, dependencies, get, 'template');
            return this.build(definition);
        },
    },
    types: [{
        name: 'template',
        schema: {
            name: {
                $_type: 'string',
                value: ''
            },
            defaults: {
                $_type: 'object',
                ofType: 'componentName',
                members: []
            },
            get: {
                $_type: 'function',
                compiled: `function(){
        return function(props){  };
      }`
            }
        },
        build(definition) {
            var app = this;
            var {
                name,
                dependencies,
                get,
                schema
            } = definition;
            if (!dependencies) dependencies = [];
            return app.injector.load(name, dependencies, (modules) => {
                modules = [].slice.call(arguments);
                var body = get.apply(this, modules);

                var component = this.createComponent(name, {
                    render() {
                        return app.createElement(body);
                    }
                });
                app.components[name] = component;
                if (callback) callback(component);
                return component;
            });
        }
    }]
};