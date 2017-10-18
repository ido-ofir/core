module.exports = {
    name: 'core.plugin.hooks',
    init(definition, done) {

        var core = this;
        

        function pushHook(name, hook, pluginName) {            
            
            if (!core.channels[name]) {
                console.warn(`channel ${ name } is defined by hooks. it is better to explicitly define a channel.`);
                core.channels[name] = [];
            }
            if (core.isFunction(hook)) {
                hook._ns = `hook ${ name } at plugin '${ pluginName }'`;
                core.tap(name, hook);
            } else if (core.isArray(hook)) {                
                hook.map(function (h, i) {
                    h._ns = `hook ${ name }(${i}) at plugin '${ pluginName }'`;
                    core.tap(name, h);
                });
            } else {
                console.warn(`core.plugin.hooks - hook '${ name }' in plugin '${ definition.name }' should be a function or an array of functions. got ${ core.typeOf(hook) }`)
            }
        }

        core.tap('core.pluginDefinition', function (pluginDefinition, next) {
            var hooks, hook, name;
            if (pluginDefinition.hooks) {
                hooks = pluginDefinition.hooks;
                // console.log('hooks', pluginDefinition.name, hooks);
                if (core.isObject(hooks)) {
                    for (name in hooks) {
                        pushHook(name, hooks[name], pluginDefinition.name);
                    }
                }
                else if(core.isArray(hooks)){
                    hooks.map(function(hook, i){
                        if(!hook.channel || !core.isString(hook.channel)){ return console.warn(`core.plugin.hooks - hook at index ${ i } in plugin ${ pluginDefinition.name } should have a 'channel' property, which should the name of an existing channel.`) }
                        if(!hook.hook || !core.isFunction(hook.hook)){ return console.warn(`core.plugin.hooks - hook at index ${ i } in plugin ${ pluginDefinition.name } should have a 'hook' function.`) }
                        pushHook(hook.channel, hook.hook, pluginDefinition.name);
                    });
                }
                else {
                    console.warn(`core.plugin.hooks - 'hooks' defined on plugin '${ pluginDefinition.name }' should be an object. got ${ core.typeOf(hooks) }`)
                }
            }
            next();
        });

        done(definition);

    }
};