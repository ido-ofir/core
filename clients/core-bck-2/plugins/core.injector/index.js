var Injector = require('./Injector.js');


module.exports = {
    name: 'core.injector',
    init(plugin, done) {
        var core = this;
        var injector = Injector();
        core.injector = injector;
        core.builders.plugin.push((plugin, done) => {
            core.injector.load(plugin.name, plugin.dependencies || [], (modules)=>{
                done(plugin);
                return plugin;
            });
        });
        core.require = injector.require;
        core.loadContext = injector.loadContext;
        core.modules = injector.modules;
        done(injector);
    }
};