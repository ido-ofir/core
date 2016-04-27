

module.exports = function Emitter(object) {
    var events = {};
    object = object || {};
    object.emit = function emit(eventName) {
        var cont, event = events[eventName];
        if (!event) return;
        var args = [].slice.call(arguments, 1);
        for (var i = 0; i < event.listeners.length; i++) {
            cont = event.listeners[i].apply(null, args);
            if (cont === false) break;
        }
        return object;
    };
    object.on = function on(eventName, listener) {
        var event = events[eventName];
        if (!event) {
            event = events[eventName] = {listeners: []};
        }
        event.listeners.push(listener);
        return object;
    };

    object.off = function off(eventName, listener) {
        if (!eventName) return (events = {});
        var event = events[eventName];
        var listeners = [];
        if (event) {
            if (!listener) event.listeners = listeners;
            else {
                for (var i = 0; i < event.listeners.length; i++) {
                    if (event.listeners[i] !== listener) {
                        listeners.push(event.listeners[i]);
                    }
                }
                if (listeners.length === 0) delete events[eventName];
                else event.listeners = listeners;
            }
        }
        return object;
    };
    return object;
};
