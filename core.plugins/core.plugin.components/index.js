

var name, pluginName, component, components;

module.exports = {
    name: 'core.plugin.components',
    dependencies: [
        'core.plugin.hooks',
        'core.components'
    ],
    hooks: {
        'core.pluginDefinition'(pluginDefinition, next){
            
            var core = this;
            
            components = pluginDefinition.components;
            if(!components){ return next(); }
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

            if(core.isObject(components)){
                length = Object.keys(components).length;
                for(name in components){
                    component = components[name];
                    if(core.isFunction(component)){
                        length--;
                        core.Component(core.prepend(pluginName, name), component);
                    }
                    else if(core.isObject(component)){
                        component = core.assign({}, component, { 
                            name: core.prepend(pluginName, name),
                            done: done
                        });
                        core.Component(component);
                    }
                    else{
                        throw new Error(`core.plugin.components - component '${ name }' in plugin '${ pluginDefinition.name }' should be a function or an object. got ${ core.typeOf(component) }`)
                    }
                }
            }
            else if(core.isArray(components)){
                length = components.length;
                components.map(function(component, i){
                    if(!component.name){
                        throw new Error(`core.plugin.components - component at index ${ i } in plugin '${ pluginName }' does not have a name`);
                    }
                    
                    component = core.assign({}, component, { 
                        name: core.prepend(pluginName, component.name),
                        done: done
                    });
                    core.Component(component);
                });
            }
            if(!length && !returned) next();
        },
        'core.plugin'(plugin, pluginDefinition, next){
            var core = this;
            var name, prefixed, pluginName, components = pluginDefinition.components;
            if(components){
                pluginName = pluginDefinition.name;
                if(!plugin.components) plugin.components = {};
                if(core.isObject(components)){
                    for(name in components){
                        prefixed = core.prepend(pluginName, name);
                        if(!core.components[prefixed]){
                            throw new Error(`core.plugin.components - cannot find component ${ prefixed }`)
                        }
                        plugin.components[name] = core.components[prefixed];
                    }
                }
                else if(core.isArray(components)){
                    components.map(function(component, i){
                        if(!component.name){
                            throw new Error(`core.plugin.components - component at index ${ i } in plugin '${ pluginName }' does not have a name`);
                        }
                        prefixed = core.prepend(pluginName, component.name);
                        if(!core.components[prefixed]){
                            throw new Error(`core.plugin.components - cannot find component ${ prefixed }`)
                        }
                        plugin.components[component.name] = core.components[prefixed];
                    });
                }
            }
            next();

        }
    }
};