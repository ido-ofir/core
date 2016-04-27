module.exports = {  
  find(collection, data, cb){
    var args = Args(arguments);
    if(!cb){
      cb = data;
      data = {};
    }
    this.run(['api', collection, 'find'], data, cb);
  },
  create(collection, data, cb){
    delete data.id;
    this.run(['api', collection, 'create'], data, cb);
  },
  update(collection, target, update, cb){
    this.run(['api', collection, 'update'], { target: target, update: update }, cb);
  },
  delete(collection, data, cb){
    this.run(['api', collection, 'delete'], data, cb);
  },
  save(obj, cb){    // usage: action.save({ user: { id: 5, name: 'koko'}, product: { id: 13, price: 38 } })
    var methods = [];
    for(var m in obj){
      var item, id, model = core.api.models[m];
      if(!model) return this.fail(`cannot find collection ${m}`);
      item = obj[m];
      if(!item) return this.fail(`param ${m} is wrong`);
      id = item.id;
      if(!id) return this.fail(`cannot save ${m} without an id`);
      methods.push(this.update(m, {id: id}, obj[m]));
    }
    async.parallel(methods, function(err, data){
        if(err) return this.fail(err);
        cb.apply(null, data);
    });
  }
};
