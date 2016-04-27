var Emitter = require('events').EventEmitter;

function listen(target, prefix, event, listener) {
    if(Array.isArray(event)){
        return event.map(function(e){ return listen(target, prefix, e, listener); });
    }
    return target.on(prefix + event, listener);
}

function options(emitter, prefix, event) {
    return {
        exceptFor: function(models, listener){
            return listen(emitter, prefix, event, function(e, next, fail){
                if(models.indexOf(e.name) > -1){
                    return next();
                }
                listener(e, next, fail);
            });
        },
        of: function(models, listener){
            return listen(emitter, prefix, event, function(e, next, fail){
                if(models.indexOf(e.name) > -1){
                    return listener(e, next, fail);
                }
                next();
            });
        }
    }
}


module.exports = function(){
    var emitter = new Emitter();
    emitter.before = function(event, listener){
        if(!listener) return options(emitter, 'before.', event);
        return listen(emitter, 'before.', event, listener);
    };
    emitter.after = function(event, listener){
        if(!listener) return options(emitter, 'after.', event);
        return listen(emitter, 'after.', event, listener);
    };
    return emitter;
};
