
module.exports = {
    name: 'core.plugin.actions',
    init(definition, done){
        
        var core = this;

        core.builders['core.pluginDefinition'].push(function(pluginDefinition, next){
            var action;
            if(core.isObject(pluginDefinition.actions)){
                
                for(var name in pluginDefinition.actions){
                    action = pluginDefinition.actions[name];
                    if(!action.name){
                        action.name = name;
                    }
                    this.Action(action);
                }
            }
            else if(core.isArray(pluginDefinition.actions)){
                for(var i = 0; i < pluginDefinition.actions.length; i++){
                    action = pluginDefinition.actions[i];
                    this.Action(action);
                }
            }
            next(pluginDefinition);
        });

        done();

    }
};