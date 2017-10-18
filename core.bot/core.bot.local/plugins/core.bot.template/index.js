
var start = '<%';
var end = '%>';

function argsFunctionString(args, body){
    return `(function(${args}){ return ${body}; })`;
}

function contextFunctionString(context, body){
    return argsFunctionString( Object.keys(context), body );
}

function functionObject(str, context){
    return eval( contextFunctionString(context, str) );
}

function compile(str, context){
    var args = Object.keys(context).map(t => context[t]);
    return functionObject(str, context).apply(context, args);
}

function template(str, context){
    var array = str.split(start);
    var result = [];
    if(array.length < 2){
        return str;
    }
    result.push(array.shift());
    array.map(item => {
        var pair = item.split(end);
        if(pair.length < 2){
            return result.push(item[0] || '');
        }
        result.push(compile(pair[0], context), pair[1]);
    })
    return result.join('');
}



module.exports = {
    name: 'core.bot.template',
    dependencies: ['core.bot.folder'],
    init(def, done){
        
        var core = this;

        function templateObject(object, context){
            
            var type = core.typeOf(object);
            if(type === 'object'){
                var result = {};
                for(var m in object){
                    result[m] = templateObject(object[m], context);
                }
                return result;
            }
            else if(type !== 'string'){
                throw new Error('cannot read template from ' + type);
            }
            return template(object, context);
        }

        var plugin = {
            template: {
                from(path, context){
                    var folder = core.read(path);
                    return templateObject(folder, context);
                },
                to(path, folderObject, context){
                    var parsed = templateObject(folderObject, context);
                    core.write(path, parsed);
                }
            },
            parseFolder(from, to, context){
                var folder = core.read(from);
                var parsed = templateObject(folder, context);
                core.write(to, parsed);
            }
        };

        core.extend(plugin);
        
        done(plugin);
    }
}