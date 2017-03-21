var Injector = require('./Injector.js');


module.exports = {
    name: 'core.injector',
    init(core) {
        var injector = Injector();
        core.injector = injector;
        core.toolChains.plugins.push((plugin, done) => {
            core.injector.load(plugin.name, plugin.dependencies || [], m => done(plugin))
        });
        core.require = injector.require;
        core.loadContext = injector.loadContext;
        core.modules = injector.modules;
    }
};