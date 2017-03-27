module.exports = {
    name: 'core.plugin.builders',
    init(definition, done) {

        var core = this;

        core.builders['core.pluginDefinition'].push(function (pluginDefinition, next) {
            var builders, hook, name;
            if (pluginDefinition.builders) {
                builders = pluginDefinition.builders;
                if (core.isObject(builders)) {
                    for (name in builders) {
                        core.builder(name, builders[name]);
                    }
                } else if (core.isArray(builders)) {
                    builders.map(function (name) {
                        core.builder(name);
                    });
                } else {
                    console.warn(`core.plugin.builders - 'builders' defined on plugin '${ pluginDefinition.name }' should be an object or an array of strings. got ${ core.typeOf(builders) }`)
                }
            }
            next(pluginDefinition);
        });

        done();

    }
};