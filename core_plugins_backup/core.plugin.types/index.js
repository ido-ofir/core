
module.exports = {
    name: 'core.plugin.types',
    init(definition, done){
        
        var core = this;

        core.channels['core.pluginDefinition'].push(function(pluginDefinition, next, done){
            var type;
            if(core.isObject(pluginDefinition.types)){
                
                for(var name in pluginDefinition.types){
                    type = pluginDefinition.types[name];
                    if(!type.name){
                        type.name = name;
                    }
                    this.Type(type);
                }
            }
            else if(core.isArray(pluginDefinition.types)){
                for(var i = 0; i < pluginDefinition.types.length; i++){
                    type = pluginDefinition.types[i];
                    this.Type(type);
                }
            }
            next(pluginDefinition);
        });

        done();

    }
};