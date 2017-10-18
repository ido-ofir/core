

/**
 * @name core.plugin.extend
 * @memberof core.plugins
 */
module.exports = {
    name: 'core.plugin.extend',
    init(definition, done){
        var core = this;
        core.channels['core.pluginDefinition'].push(function(pluginDefinition, next, done){
            
            if(pluginDefinition.extend){
                core.extend(pluginDefinition.extend);
            }
            next();
        });
        done(definition);
    }
};