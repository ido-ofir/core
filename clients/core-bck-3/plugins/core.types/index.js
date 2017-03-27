

module.exports = {
    name: 'core.types',
    dependencies: [
        'core.getDefinitionObject'
    ],
    init(definition, done){

        var core = this;

        var extend = {
            nativeTypes: {
                undefined(v){ return core.isUndefined(v); },
                null(v){ return core.isNull(v); },
                boolean(v){ return core.isBoolean(v); },
                string(v){ return core.isString(v); },
                number(v){ return core.isNumber(v); },
                array(v){ return core.isArray(v); },
                object(v){ return core.isObject(v); },
                function(v){ return core.isFunction(v); },
                any(v){ return true; }
            },
            types: {
                boolean: require('./types/boolean.js'),
                number: require('./types/number.js'),
                string: require('./types/string.js'),
                array: require('./types/array.js'),
                object: require('./types/object.js'),
                function: require('./types/function.js'),
                type: require('./types/type.js'),
                schema: require('./types/schema.js'),
                code: require('./types/code.js'),
                keyValue: require('./types/keyValue.js'),
                plugin: require('./types/plugin.js'),
            },
            Type(name, dependencies, get){
                var definition = this.getDefinitionObject(name, dependencies, get, 'type');    
                return this.build(definition);
            },
        };

        core.extend(extend);

        done(extend);

    }
}