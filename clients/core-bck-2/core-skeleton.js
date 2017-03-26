
function typeOf(thing){ // return correct native type.
    var type = Object.prototype.toString.call(thing);
    return type.substring(8, type.length -1).toLowerCase();
}

function Core(options) {

    if(!options) options = {};
    this.name = options.name || 'core';
    this.definitions = {};
    this.plugins = {};
    this.constructor = Core;
    this.core = this;
    if(options.plugins){
        options.plugins.map(plugin => this.Plugin(plugin));
    }
    if(options.extend){
        this.extend(options.extend);
    }
}

Core.prototype = {
    typeOf: typeOf,
    isUndefined(v){ return typeOf(v) === 'undefined'; },
    isNull(v){ return typeOf(v) === 'null'; },
    isBoolean(v){ return typeOf(v) === 'boolean'; },
    isNumber(v){ return typeOf(v) === 'number'; },
    isString(v){ return typeOf(v) === 'string'; },
    isArray(v){ return typeOf(v) === 'array'; },
    isObject(v){ return typeOf(v) === 'object'; },
    isFunction(v){ return typeOf(v) === 'function'; },
    emptyObject: {},
    emptyArray: [],
    emptyFunction(){},
    call(func){
        if(!this.isFunction(func)){ return func; }
        var args = [].slice.call(arguments, 1);
        return func.call(this, args);
    },
    extend(extend){
        for(var m in extend){
            if(this.isFunction(extend[m])){
                this[m] = extend[m].bind(this);
            }
            else{
                this[m] = extend[m];
            }
        }
    },
    builders: {
        plugin: []
    },
    make(name, data, callback){
        
        var core = this;
        var index = 0;
        var returned = false;
        var builder = this.builders[name];
        if(!builder) { throw new Error(`cannot find builder '${name}'`); }
        
        function done(data){
            if(returned){ throw new Error(`'${ name }' builder has returned twice`); }
            returned = true;
            if(callback) { callback(data); }
        }

        function next(data){
            if(index >= builder.length) return done(data);
            var tool = builder[index];
            index++;
            core.call(tool, data, next, done);
        }

        next(data);

    },
    Plugin(definition, callback) {

        if (!definition || !this.isObject(definition)) { throw new Error(`cannot create plugin from "${definition}"`); }
        if (!definition.name) { throw new Error(`a plugin's name is missing in Object ${ Object.keys(definition) }`); }
        
        this.definitions[definition.name] = definition;
        
        this.make('plugin', definition, (plugin) => {
            if(this.isFunction(definition.init)){
                definition.init.call(this, plugin, (plugin) => {
                    this.plugins[definition.name] = plugin;
                    callback && callback(plugin);
                });
            }
            else{
                this.plugins[definition.name] = plugin;
                callback && callback(plugin);
            }
        });
        
    }
}

module.exports = Core;