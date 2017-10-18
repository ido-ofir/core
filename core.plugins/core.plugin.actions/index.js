

module.exports = {
    name: 'core.plugin.actions',
    hooks: [{
        channel: 'core.pluginDefinition',
        hook(pluginDefinition, next){
            
            var core = this;
            var action, actionName;
            var pluginName = pluginDefinition.name;
            
            if(core.isObject(pluginDefinition.actions)){
                
                for(var name in pluginDefinition.actions){
                    action = pluginDefinition.actions[name];
                    action.name = core.prepend(pluginName, name);
                    this.Action(action);
                }
            }
            else if(core.isArray(pluginDefinition.actions)){

                for(var i = 0; i < pluginDefinition.actions.length; i++){
                    action = pluginDefinition.actions[i];
                    if(!action.name){
                        console.warn(`core.plugin.actions - action [${ i }] in plugin '${ pluginName }' does not have a name and is being ignored`);
                        continue;
                    }
                    action.name = core.prepend(pluginName, action.name);
                    core.Action(action);
                }
            }
            next();
        }
    }, {
        channel: 'core.plugin',
        hook(plugin, pluginDefinition, next){
            if(pluginDefinition.actions){
                var core = this;
                var pluginName = pluginDefinition.name;
                plugin.run = function run(name, data, promise){
                    return core.run(core.prepend(pluginName, name), data, promise, plugin);
                }
            }
            next();
        }
    }]
};