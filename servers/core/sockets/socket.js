
/*

  socketServer socket module.

  this module initializes a socket, attaches a json method on it, to make sending objects easier,
  and listens for incoming messages that have the following signature:
  {
    "type": "request",
    "id": "13",   // any type of identifier, used by the client to match the future response to this request.
    "data": {}    // any type of data, this will be the data emitted with the 'request' event.
  }
  when a valid message like this arrives the socket will dispatch a 'request' event, passing three arguments:

  the first argument is the data that arrived as the 'data' property of the incoming message.

  the second argument is a success callback that will return whatever is passed to it back to the client as successful response:
    {
      type: 'response',
      success: true,
      id: id,
      data: data    // whatever you passed to the success callback
    }

  the third argument is a fail callback that will return whatever is passed to it back to the client as a failed response:
    {
      type: 'response',
      success: false,
      id: id,
      error: error    // whatever you passed to the fail callback
    }

*/




var utils = require('../utils');

function json(obj){
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error(e)
  }
}

module.exports = function(socket){
  socket.on('message', function(message){
    var msg = utils.parse(message);
    if(msg.type){
      socket.emit(msg.type, msg.data);
    }
  });
  socket.json = function(obj){
      socket.send(json(obj));
  };
  return socket;
}
