module.exports = {
  $_type: 'plugin',
  name: 'asset',
  tree: {
      types: [],
      instances: [],
      watchers: []
  },
  init(def, done){

      var core = this;

      var plugin = {
        type(type){
            if(core.isArray(type)){
                return type.map(t => plugin.type(t));
            }
            if(!core.isObject(type)){
                throw new Error(`cannot create type from ${ core.typef(type) }`)
            }
            this.select('types').push(type);
        },
        instance(instance){
            var type = this.select(['types', { id: instance.type }]);
            if(!type.exists()){
                throw new Error(`cannot find type '${ instance.type }'`)
            }
            var instances = this.select('instances');
            var existing = instances.select({ id: instance.id });
            if(existing.exists()){
                existing.set(instance);
            }
            else{
                instances.push(instance);
            }
        },
        watch(type, instanceId){
            var instance = this.select(['instances', { type: type, id: instanceId }]);
            if(!instance.exists()){
                throw new Error(`cannot find instance of '${ type }' with id '${ instanceId }'`)
            }
            var watchers = this.select('watchers');
            var watcher = {
                id: core.uuid(),
                type: type,
                instance: instanceId,
                _listeners: [],
                _update(value){
                    this._listeners.map(l => l(value));
                },
                onChange(cb){
                    this._listeners.push(cb);
                },
                release(){
                    var mounts = instance.get('_mounts') || [];
                    instance.set('_mounts', mounts - 1);
                    if(!instance.get('_mounts')){
                        instance.set('_unmountedSince', new Date().getTime());
                    }
                }
            }
            watchers.push(watcher);
            return watcher;
        }        
      };

      function garbageCollect(){

      }

      done(plugin);
  }
};