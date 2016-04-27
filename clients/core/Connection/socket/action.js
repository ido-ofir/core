
function noSuccess(data){
  console.log('socket success:');
  console.dir(data);
}
function noFail(err){
  console.log('socket fail:');
  console.dir(err);
}

module.exports = function(socket){
    return function(path, data, success, fail){
        if(!success) success = noSuccess;
        if(!fail) fail = noFail;        
        socket.request('action', {
          path: path,
          data: data
        }, function(response){
          if (response.success === true) success(response.data);
          else fail(response.message);
        });
    };
};
