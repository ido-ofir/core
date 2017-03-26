
function Emitter(){
  this.events = {};
}

Emitter.prototype = {
  on(eventName, listener){  // return false in listener to stop the event
    var event = this.events[eventName];
    if (!event) {
        event = this.events[eventName] = [];
    }
    event.push(listener);
    return this;
  },
  off(eventName, listener){
    if (!eventName){
      this.events = {};
      return this;
    }
    if (!listener){
      delete this.events[eventName];
      return this;
    }
    var event = this.events[eventName];
    if (event) {
        event = this.events[eventName] = event.filter((l)=>{
          return (l === listener);
        });
        if (!event.length) delete this.events[eventName];
    }
    return this;
  },
  emit(eventName){
    var cont, event = this.events[eventName];
    if (!event) return;
    var args = [].slice.call(arguments, 1);
    for (var i = 0; i < event.length; i++) {
        cont = event[i].apply(null, args);
        if (cont === false) break;
    }
    return this;
  }
};

module.exports = function(object) {
    var emitter = new Emitter();
    if(object){
      for(var m in object){
        emitter[m] = object[m];
      }
    }
    return emitter;
};
