
function exec(action){
  return function(err, data){
      if(err) return action.error(err);
      action.done(data);
  }
}

function RouteAction(model){
  this.model = model;
}
RouteAction.prototype = {
  find(action){
    this.model.find(action.request, exec(action));
  },
  create(action){
    this.model.create(action.request, exec(action));
  },
  update(action){
    var target = action.request.target;
    var update = action.request.update;
    this.model.update(target, update, exec(action));
  },
  delete(action){
    this.model.delete(action.request, exec(action));
  }
};

module.exports = RouteAction;
