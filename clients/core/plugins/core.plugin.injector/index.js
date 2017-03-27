

module.exports = {
    name: 'core.plugin.injector',
    dependencies: ['core.injector'],
    init(definition, done) {

        var core = this;

        core.channels['core.pluginDefinition'].push((definition, next, done) => {

            if (!definition.dependencies || !definition.dependencies.length) {
                return next(definition);
            }
            core.injector.require(definition.dependencies, (modules) => {
                next(definition);
            });
        });

        core.channels['core.plugin'].push((plugin, def, next, done) => {
            if (def.name) {
                core.injector.add(def.name, plugin || def);
            }
            next(plugin, def);
        });

        done();
    }
};