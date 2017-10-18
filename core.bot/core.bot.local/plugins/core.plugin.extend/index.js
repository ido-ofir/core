

/**
 * @name core.plugin.extend
 * @memberof core.plugins
 * @description Allows plugins to declaratively extend the core object.
 * @example
 * 
 * core.plugin(
 *     require('core.plugin.core.plugin.extend')
 * );
 * 
 * core.plugin({
 *     name: 'test',
 *     extend: {
 *         ok(){ return '√'; }
 *     }
 * });
 * 
 * core.ok();  // '√'
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