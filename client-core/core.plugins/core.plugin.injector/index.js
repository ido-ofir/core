

module.exports = {
    name: 'core.plugin.injector',
    dependencies: ['core.injector'],
    init(definition, done) {

        var core = this;

        core.tap('core.pluginDefinition', (definition, next, done) => {

            if (!definition.dependencies || !definition.dependencies.length) {
                return next();
            }
            core.injector.require(definition.dependencies, (modules) => {
                next();
            }, `plugin '${ definition.name }'`);
        });

        core.tap('core.plugin', (plugin, def, next, done) => {
            if (def.name) {
                core.injector.add(def.name, plugin || def);
            }
            next();
        });

        done(definition);
    }
};