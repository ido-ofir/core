
function Route(name){
  this.name = name;
}
Route.prototype = {
  find(data, user, cb){
    core.actions.run(['api', this.name, 'find'], data, user, cb);
  },
  create(data, user, cb){
    core.actions.run(['api', this.name, 'create'], data, user, cb);
  },
  update(target, update, user, cb){
    core.actions.run(['api', this.name, 'update'], { target: target, update: update }, user, cb);
  },
  delete(data, user, cb){
    core.actions.run(['api', this.name, 'delete'], data, user, cb);
  }
}
module.exports = Route;
