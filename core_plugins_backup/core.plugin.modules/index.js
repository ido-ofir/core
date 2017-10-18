

var name, pluginName, mod, modules;

module.exports = {
    name: 'core.plugin.modules',
    dependencies: [
        'core.plugin.hooks',
        'core.modules'
    ],
    hooks: {
        'core.pluginDefinition'(pluginDefinition, next){
            var core = this;
            modules = pluginDefinition.modules;
            if(!modules){ return next(); }
            pluginName = pluginDefinition.name;
            var count = 0;
            var length, returned = false;

            function done(){
                
                count++;
                if(count === length){
                    returned = true;
                    next();
                }
            }

            if(core.isObject(modules)){
                length = Object.keys(modules).length;
                for(name in modules){
                    mod = modules[name];
                    if(core.isObject(mod)){
                        core.Module({ 
                            name: core.prepend(pluginName, name),
                            value: mod,
                            done: done
                        });
                    }
                    else{
                        throw new Error(`core.plugin.modules - module '${ name }' in plugin '${ pluginDefinition.name }' should be a an object. got ${ core.typeOf(mod) }`)
                    }
                }
            }
            else if(core.isArray(modules)){
                length = modules.length;
                modules.map(function(mod, i){
                    if(!mod.name){
                        throw new Error(`core.plugin.modules - module at index ${ i } in plugin '${ pluginName }' does not have a name`);
                    }
                    mod = core.assign({}, mod, { 
                        name: core.prepend(pluginName, mod.name),
                        done: done
                    });
                    core.Module(mod);
                });
            }
            if(!length && !returned) next();
        },
        'core.plugin'(plugin, pluginDefinition, next){
            var name, prefixed, pluginName, modules = pluginDefinition.modules;
            if(!plugin) { return next(); }
            if(modules){
                pluginName = pluginDefinition.name;
                if(!plugin.modules) plugin.modules = {};
                if(core.isObject(modules)){
                    for(name in modules){
                        prefixed = core.prepend(pluginName, name);
                        if(!core.modules[prefixed]){
                            throw new Error(`core.plugin.modules - cannot find module ${ prefixed }`)
                        }
                        plugin.modules[name] = core.modules[prefixed];
                    }
                }
                else if(core.isArray(modules)){
                    modules.map(function(mod, i){
                        if(!mod.name){
                            throw new Error(`core.plugin.modules - module at index ${ i } in plugin '${ pluginName }' does not have a name`);
                        }
                        prefixed = core.prepend(pluginName, mod.name);
                        if(!core.modules[prefixed]){
                            throw new Error(`core.plugin.modules - cannot find module ${ prefixed }`)
                        }
                        plugin.modules[mod.name] = core.modules[prefixed];
                    });
                }
            }
            next();
        }
    }
};