

function typeOf(thing){
    var type = Object.prototype.toString.call(thing);
    return type.substring(8, type.length -1).toLowerCase();
}

/**
 * @name core
 * @constructor
 * @param {object} options - instance options.
 * @param {string} options.name - a unique name for the instance.
 * @param {array} options.plugins - an array on plugins to initialize on the instance.
 * @param {object} options.extend - if provided, this object will be merged in to the new instance.
 * @example
 * var core = new Core({
 *     name: 'client-core',
 *     plugins: [
 *         require('./pluginA'),
 *         require('./pluginB')
 *     ]
 * });
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
     * @name core.typeOf
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
     * @description Checks if a value is a date object.
     * @param {any} thing - anything you want. 
     * @return {boolean} - true if 'thing' is an array. false otherwise.
     * @example
     * core.isDate('6/3/81'); // false
     * core.isDate(new Date('6/3/81')); // true
    
     * */
    isDate(v){ return typeOf(v) === 'date'; },
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
     * @function
     * @description Copies all properties from 'source' to 'target', similar to Object.assign.
     * @param {object} target - The target object. properties will be copied to this object.
     * @param {object} source - A source, or a number of source objects.
     * @param {function} assignFunc - A function that will be called for each property assignment.
     * if provided, the assigned value will be the return value of this function.
     * @return {object} - The target object ( the first parameter ).
     * @example
     * core.assign({}, {a: 1, b: 2}, (property, key, source) => property + 1);   // { a: 2, b: 3 }
     * */
    assign(target, source, assignFunc) {

        var core = this;
        var desc, property, func, args = [].slice.call(arguments, 1);
        if (!core.isObject(target)) { throw new Error(`core.assign() - first argument should be an object. got ${ this.typeOf(target) }`); }
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
     * @description Copies all members in 'properties' to the core instance.
     * @param {object} properties - An 
     * @return {object} - Returns the target object ( the first parameter ).
     * @example
     * core.extend({
     *     getData(){ return this.myData; },
     *     myData: 45
     * });
     * 
     * core.getData();  // 45.
     * core.myData;  // 45.
     * */
    extend(properties){

        var core = this;
        core.assign(core, properties, function(property){
            if(core.isFunction(property)){ return property.bind(core); }
            return property;
        });
    },
    /**
     * A namespace object to hold named channels.
     */
    channels: {
        'core.pluginDefinition': [],
        'core.plugin': []
    },
    /** 
     * @function
     * @description Adds a new channel to the channels namespace object.
     * @param {string} name - The name of the channel.
     * @param {array} array - Optional array of functions.
     * @return {undefined}
     * @example
     * core.channel('collection');
     * core.channels.collection; // [].
     * */
    channel(name, array){
        if(!name) throw new Error('core.channel() was called without a name');
        if(!this.isString(name)) throw new Error(`core.channel() - expected first argument to be a string. got ${ this.typeOf(name) }`);
        if(this.isFunction(array)){ array = [array]; }
        else if(!this.isArray(array)){
            array = [];
        }
        this.channels[name] = array;
    },
    /** 
     * @function
     * @description Adds a tap to a channel.
     * @param {string} name - The name of the channel.
     * @param {function} func - A function to attach to the channel.
     * @return {undefined}
     * @prop asd.asd.asd
     * @example
     * core.channel('dataType');
     * 
     * core.tap('dataType', (dataType, done) => {
     *     dataType.test = 'ok';
     *     done(dataType);
     * });
     * 
     * core.fire('dataType', {}, (dataType) => {
     *     dataType.test; // 'ok'
     * });
     * */
    tap(name, func){
        if(!name) throw new Error('core.tap() was called without a name');
        if(!this.isString(name)){ throw new Error(`core.tap() - expected first argument to be a string. got ${ this.typeOf(name) }`); }
        if(!this.isFunction(func)){ throw new Error(`core.tap() - expected second argument to be a function. got ${ this.typeOf(func) }`); }
        if(!this.isArray(this.channels[name])){ throw new Error(`core.tap() - cannot find channel ${ name }`); }
        this.channels[name].push(func);
    },
    /** 
     * @function
     * @description Runs data through a named channel.
     * @param {string} name - The name of the channel.
     * @param {any} data - Data to be passed through the channel.
     * @param {function} callback - A function that will be called when the job completes.
     * @return {undefined}
     * @example
     * core.channel('dataType', (dataType, done) => {
     *     dataType.test = 'ok';
     *     done(dataType);
     * });
     * 
     * core.fire('dataType', {}, (dataType) => {
     *     dataType.test; // 'ok'
     * });
     * */
    fire(name, data, callback){
        
        var core = this;
        var index = 0;
        var returned = false;
        var channel = core.channels[name];
        var args = [].slice.call(arguments, 1);
        callback = args.pop();
        if(!channel) { throw new Error(`cannot find channel '${name}'`); }
        if(!core.isFunction(callback)){
            args.push(callback);
            callback = null;
        }
        
        function done(){
            index++;
            if(returned){ throw new Error(`'${ name }' channel has returned twice`); }
            returned = true;
            if(callback) { callback.apply(null, args); }
        }

        function next(){
            if(index >= channel.length) {
                return done();
            }
            var tool = channel[index];
            index++;
            var t = index;
            setTimeout(function(){ 
                if(t !== index){ return }
                var ns = tool._ns ? tool._ns : (tool.name ? `function ${ tool.name } in channel ${ name }` : `function at index ${ t - 1 } in channel ${ name }`);
                console.warn(`${ ns } did not call next().`, args);
            }, 3000);
            tool.apply(core, args.concat([next, done]))
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
        
        core.fire('core.pluginDefinition', definition, () => {
            var isDone = false;
            function done(plugin){
                isDone = true;
                core.fire('core.plugin', plugin, definition, (plugin)=>{
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
                definition.init.call(core, definition, done);
            }
            else{ done(definition); }
        });
        
    }
}

module.exports = Core;