

function typeOf(thing){
    var type = Object.prototype.toString.call(thing);
    return type.substring(8, type.length -1).toLowerCase();
}

/**
 * @namespace
 * @constructor
 * @param {object} options - instance options sadasdf.
 * @param {string} options.name - a unique name for the instance.
 * @param {array} options.plugins - an array on plugins to initialize on the instance.
 * @param {object} options.extend - if provided, this object will be merged in to the new instance.
 */
function Core(options) {

    var core = this;
    if(!options) options = {};
    core.name = options.name || 'core';
    core.definitions = {};
    core.plugins = {};
    core.constructor = Core;
    core.core = core;
    if(options.plugins){
        options.plugins.map(plugin => core.plugin(plugin));
    }
    if(options.extend){
        core.extend(options.extend);
    }
}


Core.prototype = {
    /** 
     * @function
     * @description Returns the correct native type in javascript ( unlike the 'typeof' operator ).
     * @param {any} thing - anything you want. 
     * @return {string} The native javascript type - 'undefined', 'null', 'boolean', 'number', 'string', 'array', 'object' or 'function'. 
     * @example
     *   
     * typeof null; // 'object'
     * typeof []; // 'object'
     * 
     * core.typeOf(null); // 'null'
     * core.typeOf([]); // 'array'
     * 
     * */
    typeOf: typeOf,
    /** 
     * @function
     * @description Checks if a value is undefined.
     * @param {any} thing - anything you want. 
     * @return {boolean} - true if 'thing' is undefined. false otherwise.
     * @example
     * core.isUndefined(null); // false
     * */
    isUndefined(v){ return typeOf(v) === 'undefined'; },
    /** 
     * @function
     * @description Checks if a value is null.
     * @param {any} thing - anything you want. 
     * @return {boolean} - true if 'thing' is null. false otherwise.
     * @example
     * core.isNull(null); // true
     * */
    isNull(v){ return typeOf(v) === 'null'; },
    /** 
     * @function
     * @description Checks if a value is a boolean.
     * @param {any} thing - anything you want. 
     * @return {boolean} - true if 'thing' is boolean. false otherwise.
     * @example
     * core.isBoolean(false); // true
     * core.isBoolean(''); // false
     * */
    isBoolean(v){ return typeOf(v) === 'boolean'; },
    /** 
     * @function
     * @description Checks if a value is a number.
     * @param {any} thing - anything you want. 
     * @return {boolean} - true if 'thing' is a number. false otherwise.
     * @example
     * core.isNumber('35'); // false
     * core.isNumber(35); // true
     * */
    isNumber(v){ return typeOf(v) === 'number'; },
    /** 
     * @function
     * @description Checks if a value is a string.
     * @param {any} thing - anything you want. 
     * @return {boolean} - true if 'thing' is a string. false otherwise.
     * @example
     * core.isString('35'); // true
     * core.isString(35); // false
     * */
    isString(v){ return typeOf(v) === 'string'; },
    /** 
     * @function
     * @description Checks if a value is an array.
     * @param {any} thing - anything you want. 
     * @return {boolean} - true if 'thing' is an array. false otherwise.
     * @example
     * core.isArray({}); // false
     * core.isArray([]); // true
     * */
    isArray(v){ return typeOf(v) === 'array'; },
    /** 
     * @function
     * @description Checks if a value is an object.
     * @param {any} thing - anything you want. 
     * @return {boolean} - true if 'thing' is an object. false otherwise.
     * @example
     * core.isObject({}); // true
     * core.isObject([]); // false
     * */
    isObject(v){ return typeOf(v) === 'object'; },
    /** 
     * @function
     * @description Checks if a value is a function.
     * @param {any} thing - anything you want. 
     * @return {boolean} - true if 'thing' is a function. false otherwise.
     * @example
     * core.isFunction({}); // false
     * core.isFunction(e => {}); // true
     * */
    isFunction(v){ return typeOf(v) === 'function'; },
    /** 
     * An empty object.
     * */
    emptyObject: {},
    /** 
     * An empty array.
     * */
    emptyArray: [],
    /** 
     * An empty function.
     * */
    emptyFunction(){},
    /** 
     * @function
     * @description Calls a function in the context of the core instance.
     * @param {function} func - The function to call.
     * @param {any} rest - The rest of the arguments will be passed to the function.
     * @return {any} - Whatever the function has returned.
     * @example
     * core.call(function(){
     *     console.log(this === core);  // true.
     * });
     * */
    call(func){

        var core = this;
        if(!core.isFunction(func)){ return func; }
        var args = [].slice.call(arguments, 1);
        return func.apply(core, args);
    },
    /** 
     * @function
     * @description Copies all properties from 'source' to 'target', similar to Object.assign.
     * @param {object} target - The target object. properties will be copied to this object.
     * @param {object} source - A source, or a number of source objects.
     * @param {function} assignFunc - A function that will be called for each property assingment.
     * if provided, the assigned value will be the return value of this function.
     * @return {object} - The target object ( the first parameter ).
     * @example
     * core.assign({}, {a: 1, b: 2}, t => t + 1);   // { a: 2, b: 3 }
     * */
    assign(target, source, assignFunc) {

        var core = this;
        var desc, property, func, args = [].slice.call(arguments, 1);
        if (!core.isObject(target)) { throw new TypeError('core.assign - first argument is not an object'); }
        if (core.isFunction(args[args.length - 1])) { func = args.pop(); }
        args.map(function(source){
            if(!core.isObject(source)) return;
            for(var key in source){
                desc = Object.getOwnPropertyDescriptor(source, key);
                if (desc && desc.enumerable) {
                    property = source[key]
                    target[key] = func ? func(property, key, source) : property;
                }
            }
        });
        return target;
    },
    /** 
     * @function
     * @description Copies all properties from 'source' to 'target', similar to Object.assign.
     * @param {object} properties - An 
     * @return {object} - Returns the target object ( the first parameter ).
     * @example
     * core.extend({ getData(){ return this.myData; }, myData: 45 });
     * core.getData();  // 45.
     * */
    extend(properties){

        var core = this;
        core.assign(core, properties, function(property){
            if(core.isFunction(property)){ return property.bind(core); }
            return property;
        });
    },
    /**
     * A namespace object to hold named builders.
     */
    builders: {
        'core.pluginDefinition': [],
        'core.plugin': []
    },
    /** 
     * @function
     * @description Adds a new builder to the builders namespace object.
     * @param {string} name - The name of the builder.
     * @param {array} array - Optional array of functions.
     * @return {undefined}
     * @example
     * core.builder('collection');
     * core.builders.collection; // [].
     * */
    builder(name, array){
        if(!name) throw new Error('core.Builder was called without a name');
        if(!this.isString(name)) throw new Error('core.Builder - expected first argument to be a string. got ${ this.typeOf(name) }');
        if(!this.isArray(array)){
            array = [];
        }
        this.builders[name] = array;
    },
    /** 
     * @function
     * @description Runs data through a named builder.
     * @param {string} name - The name of the builder.
     * @param {any} data - Data to be passed through the builder.
     * @param {function} callback - A function that will be called when the job completes.
     * @return {undefined}
     * @example
     * core.builder('dataType');
     * core.make('dataType', {}, (dataType) => {
     *     // dataType may have been altered by builder functions
     * });
     * */
    make(name, data, callback){
        
        var core = this;
        var index = 0;
        var returned = false;
        var builder = core.builders[name];
        var args = [].slice.call(arguments, 1);
        callback = args.pop();
        if(!builder) { throw new Error(`cannot find builder '${name}'`); }
        if(!core.isFunction(callback)){
            args.push(callback);
            callback = null;
        }
        
        function done(data){
            index++;
            if(returned){ throw new Error(`'${ name }' builder has returned twice`); }
            returned = true;
            if(callback) { callback(data); }
        }

        function next(data){
            if(index >= builder.length) {
                return done(data);
            }
            var tool = builder[index];
            index++;
            var t = index;
            setTimeout(function(){ 
                if(t === index){
                    var ns = tool._ns ? tool._ns : (tool.name ? `function ${ tool.name } in builder ${ name }` : `function at index ${ t - 1 } in builder ${ name }`);
                    console.warn(`${ ns } did not call next().`);
                }
            }, 3000);
            var callArgs = [].slice.call(arguments);
            callArgs.unshift(tool)
            callArgs.push(next, done);
            core.call.apply(core, callArgs);
        }

        next.apply(null, args);

    },
    /** 
     * @function
     * @description Adds a plugin to core instance.
     * @param {object} definition - The plugin definition.
     * @param {string} definition.name - The name of the plugin.
     * @param {function} callback - A function that will be called when the job completes.
     * @return {undefined}
     * @example
     * core.plugin('myPlugin', {
     *     getData(){ return 47; }
     * });
     * core.plugins.myPlugin.getData();  // 47.
     * */ 
    plugin(definition, callback) {

        var i, core = this;
        if (!definition) { throw new Error(`cannot create plugin from "${definition}"`); }
        if(core.isArray(definition)){
            i = 0;
            function done(){
                i += 1;
                if(1 >= definition.length){ callback && callback() }
            }
            return definition.map(function(def){
                core.plugin(def, done);
            });
        }
        if(!core.isObject(definition)){ throw new Error(`cannot create plugin from "${definition}"`); }
        if (!definition.name) { throw new Error(`a plugin's name is missing in Object ${ Object.keys(definition) }`); }
        
        core.definitions[definition.name] = definition;
        
        core.make('core.pluginDefinition', definition, (plugin) => {
            var isDone = false;
            function done(plugin){
                isDone = true;
                core.make('core.plugin', plugin, definition, (plugin)=>{
                    core.plugins[definition.name] = plugin || '√';
                    callback && callback(plugin);
                });
            }
            setTimeout(function(){
                if(!isDone){
                    console.warn(`plugin ${ definition.name } has defined an init function but did not call done().`);
                }
            }, 3000);
            if(core.isFunction(definition.init)){
                definition.init.call(core, plugin, done);
            }
            else{ done(plugin); }
        });
        
    }
}

module.exports = Core;