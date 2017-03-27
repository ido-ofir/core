module.exports = {
    name: 'core.plugin.extend',
    init(plugin, done){
        var core = this;
        core.channels['core.pluginDefinition'].push(function(definition, next, done){
            
            if(definition.extend){
                core.extend(definition.extend);
            }
            next(definition);
        });
        done('√');
    }
};