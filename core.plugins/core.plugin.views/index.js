
module.exports = {
    name: 'core.plugin.views',
    hooks: [{
        channel: 'core.pluginDefinition',
        hook(pluginDefinition, next){
            var core = this;
            if(pluginDefinition.views){
                pluginDefinition.views.map(function(view){
                    var a, m, v = core.assign({}, view, { name: core.prepend(pluginDefinition.name, view.name) });
                    if(view.bindings){
                        if(core.isObject(view.bindings)){
                            v.bindings = {};
                            for(m in view.bindings){
                                a = view.bindings[m];
                                if(core.isString(a)){
                                    a = [a];
                                }
                                if(a[0] !== pluginDefinition.name){
                                    a.unshift(pluginDefinition.name);
                                }
                                if(a[0] !== 'plugins'){
                                    a.unshift('plugins');
                                }
                                v.bindings[m] = a;
                            }
                        }
                    }
                    core.View(v);
                });
            }
            next();
        }
    }, {
        channel: 'core.plugin',
        hook(plugin, pluginDefinition, next){
            var core = this;
            if(pluginDefinition.views){
                if(!plugin.views) { plugin.views = {}; }
                pluginDefinition.views.map(function(view){
                    plugin.views[view.name] = core.prepend(pluginDefinition.name, view.name);
                });
            }
            next();
        }
    }]
};