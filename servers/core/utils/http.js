
function fail(res, err){
  res.json({
    success: false,
    error: err
  });
}

function Fail(res){
  return function(err){
    fail(res, err)
  };
}

function reject(res, obj){
  res.json({
    success: false,
    reject: obj
  });
}

function query(res){
  return function(err, data){
    if(err){

    }
  }
}

module.exports = {
  fail: fail,
  reject: reject,
  query: query
};
