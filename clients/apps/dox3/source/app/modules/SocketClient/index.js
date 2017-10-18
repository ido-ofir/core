var q = require('q');

function Client(options) {

  this.options = options || {};
  this.requests = [];
  this.id = 0;
  this.queue = [];
  this.isConnected = false;
  this.isAuthorized = false;
  this.events = {};

  if(options.url){
    this.connect(options.url);
  }

}

Client.prototype = {
    log(){
      if(this.options.log){
        console.log.apply(console, [ 'chat-client -', ...arguments ]);
      }
    },
    connect(url, cb){

      var client = this;
      client.log('connecting socket');
      if(client.socket){
        client.socket.close();
      }
      var { actions, onOpen, onError, onMessage, onClose } = client.options;
      var socket = new WebSocket(url);
      client.socket = socket;
      client.url = url;

      socket.onopen = function(){

        client.isConnected = true;
        if(onOpen) onOpen(socket);
        if(cb) cb(socket);
        if(client.queue.length){
          client.queue.map(cb => cb());
          client.queue.length = 0;
        }

        client.log('socket opened');
        client.emit('open');

      };



      socket.onclose = function(){

        client.isConnected = false;

        if(onClose) onClose(socket);

        client.log('socket closing');
        client.emit('close');

      };

      socket.onerror = function(err){

        client.log('error:', err);

        client.isConnected = false;
        if(onError) onError(err);
        client.emit('error');

      };

      socket.onmessage = function(msg){

        var json = JSON.parse(msg.data);

        client.log('got:', json);

        if(json.type) { // emit an event with the name of the action.
          client.emit(json.type, json.data);
        }
        else {  // action was initiated by the client, return to the initiating callback.
          var requests = client.requests;
          for (var i = 0; i < requests.length; i++) {
            if(requests[i].id === json.id){
              if(json.error) {
                client.log('rejecting promise', json.error);
                requests[i].promise.reject(json.error);
              }
              else {
                client.log('resolving promise', json.data);
                requests[i].promise.resolve(json.data);
              }
              requests.splice(i, 1);
              break;
            }
          }
        }
        client.emit('message', json);  // in any case, emit a generic 'message' event.

      };

    },

    close(){

      if(this.socket){
        this.socket.close();
      }

    },

    on(eventName, listener){  // add a listener to 'eventName', return false in listener to stop the event.

      var event = this.events[eventName];
      if (!event) {
          event = this.events[eventName] = {listeners: []};
      }
      event.listeners.push(listener);
      return this;

    },
    off(eventName, listener){   // remove a listener.

      if (!eventName){   // calling off() with no arguments removes all listeners for all events.
        this.events = {};
      }
      else if (!listener){    // calling off('eventName') with no listener removes all event listeners for 'eventName'.
        delete this.events[eventName];
      }
      else{   // calling off('eventName', listener) will only remove listener.
        var event = this.events[eventName];
        if (event) {
            event.listeners = event.listeners.filter((l)=>{
              return (l === listener);
            });
            if (!event.listeners.length) delete this.events[eventName];
        }
      }
      return this;

    },
    emit(eventName, ...args){  // emit a named event

      this.log('emitting ' + eventName, args);

      var cont, event = this.events[eventName];
      if (!event) return;
      for (var i = 0; i < event.listeners.length; i++) {
          cont = event.listeners[i].apply(null, args);
          if (cont === false) break;  // if a listener returned false, stop here.
      }
      return this;

    },
    run(type, data, promise){  // run an action on the server.

      var deffered = promise || q.defer();
      if(!this.isConnected) return deffered.promise;
      if(!data) {
        data = {};
      }
      this.id += 1;
      var request = { type: type, data: data, id: this.id };

      var stringified = JSON.stringify(request);

      this.log('running server action ' + type, request);

      request.promise = deffered;
      deffered.promise.catch(this.options.onError || this.error);

      this.requests.push(request);
      this.socket.send(stringified);

      return deffered.promise;

    },
    whenOpened(cb){

      if(!this.isConnected) return this.queue.push(cb);
      cb();

    },
    authorize(data, cb) {

      return this.run('authorize', data).then(data => {
        this.isAuthorized = true;
        cb(data);
      });

    }

};

module.exports = Client;
