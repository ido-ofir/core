
module.exports = {
    name: 'core.plugin.components',
    dependencies: [
        'core.plugin.hooks',
        'core.components'
    ],
    hooks: {
        'core.pluginDefinition'(pluginDefinition, next){
            var core = this;
            var name, component, components = pluginDefinition.components;
            if(components){
                if(core.isObject(components)){
                    for(name in components){
                        component = components[name];
                        if(core.isFunction(component)){
                            core.Component(name, component);
                        }
                        else if(core.isObject(component)){
                            core.Component(component);
                        }
                        else{
                            throw new Error(`core.plugin.components - component '${ name }' in plugin '${ pluginDefinition.name }' should be a function or an object. got ${ core.typeOf(component) }`)
                        }
                    }
                }
            }
            next(pluginDefinition);
        }
    }
};