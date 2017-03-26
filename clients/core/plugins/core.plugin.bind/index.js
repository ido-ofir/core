
function bind(name, bindings, render){
    if(!this.isFunction(render)){
        if(this.isFunction(bindings)){
            render = bindings;
            return this.bind(['plugins', name], render);
        }
        else{
            throw new Error(`core.plugin.bind - missing render function for plugin ${ name }`);
        }
    }
    if(this.isArray(bindings)){
        bindings = ['plugins', name].concat(bindings);
    }
    else if(this.isObject(bindings)){
        var core = this;
        bindings = this.assign({}, bindings, function(binding, key){
            if(core.isString(binding)){
                return ['plugins', name, binding];
            }
            else if(core.isArray(binding)){
                return ['plugins', name].concat(binding);
            }
            else{
                throw new Error(`core.plugin.bind - plugin ${ name }'s bind function was called with invalid binding ${ key }.`);
            }
        });
    }
    else if(this.isString(bindings)){
        return this.bind(['plugins', name, bindings], render);
    }
    else{
        throw new Error(`core.plugin.bind - plugin ${ name }'s bind function was called with invalid binding ${ key }.`);
    }
}

module.exports = {
    name: 'core.plugin.bind',
    dependencies: [
        'core.tree',
        'core.bindings'
    ],
    init(definition, done){
        
        var core = this;


        core.builders['core.plugin'].push(function (plugin, definition, next) {
            
            if (plugin && definition.tree) {
                var name = definition.name;
                if(!plugin.bind) plugin.bind = bind.bind(core, name);
            }

            next(plugin, definition);

        });
        
        done('√');

    }
};