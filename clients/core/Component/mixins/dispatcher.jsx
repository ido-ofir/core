module.exports = {
  getInitialState(){
    this._events = {};
  },
  on(eventName, listener){  // return false in listener to stop the event
    console.log('on', eventName, this.constructor.displayName);
    var event = this._events[eventName];
    if (!event) {
        event = this._events[eventName] = {listeners: []};
    }
    event.listeners.push(listener);
  },
  off(eventName, listener){ // remove a listener for an event, all listeners for an event, or all listeners for all events.
    if (!eventName){
      this._events = {};
      return this;
    }
    if (!listener){
      delete this._events[eventName];
      return this;
    }
    var event = this._events[eventName];
    if (event) {
        event.listeners = event.listeners.filter((l)=>{
          return (l === listener);
        });
        if (!event.listeners.length) delete this._events[eventName];
    }
  },
  dispatch(eventName){   // dispatch an event to all listeners in this object. if the event was canceled return false.
    var cont, event = this._events[eventName];
    if (!event) return true;
    var args = [].slice.call(arguments, 1);
    for (var i = 0; i < event.listeners.length; i++) {
        cont = event.listeners[i].apply(null, args);
        if (cont === false) return false;
    }
    return true;
  }
};
