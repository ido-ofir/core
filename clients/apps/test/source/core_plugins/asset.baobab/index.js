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
        type(type){  // { id, schema }
            if(!type){
                throw new Error(`empty asset type definition`)
            }
            if(core.isString(type)){
                type = { id: type, schema: [] };
            }
            if(core.isArray(type)){
                return type.map(t => plugin.type(t));
            }
            if(!core.isObject(type)){
                throw new Error(`cannot create type from ${ core.typeOf(type) }`);
            }
            var types = this.select('types');
            var existing = types.select({ id: type.id });
            if(existing.exists()){
                console.warn(`asset type '${ type.id }' already exists, overriding..`);
                existing.set(type);
            }
            else{
                types.push(type);
            }
        },
        getInstance(type, id){
            return this.get(['instances', { type: type, id: id }]) || null;
        },
        instance(instance){  // { type, id, value }
            if(core.isString(instance)){
                var a = arguments;
                instance = { type: a[0], id: a[1], value: a[2], } 
            }
            else{
                if(!core.isObject()){
                    throw new Error(`cannot create asset instance from '${ core.typeOf(instance) }'`);
                }
            }
            instance = core.assign({}, instance, {
                get(){
                    var cursor = plugin.select(['instances', { type: instance.type, id: instance.id }]);
                    if(!cursor.exists()){
                        throw new Error(`cannot get asset instance, instance '${ instance.id }' of type '${ instance.type }' is missing.`);
                    }
                    return cursor.get('value');
                },
                set(value){
                    var cursor = plugin.select(['instances', { type: instance.type, id: instance.id }]);
                    if(!cursor.exists()){
                        throw new Error(`cannot set asset instance, instance '${ instance.id }' of type '${ instance.type }' is missing.`);
                    }
                    cursor.set('value', value);
                }
            });
            var type = this.select(['types', { id: instance.type }]);
            if(!type.exists()){
                throw new Error(`cannot find asset type '${ instance.type }'`)
            }
            var instances = this.select('instances');
            var existing = instances.select({ id: instance.id });
            if(existing.exists()){
                existing.set(instance);
            }
            else{
                instances.push(instance);
            }
            return instance;
        },
        watch(type, instanceId, onChange){
            var instance = this.select(['instances', { type: type, id: instanceId }]);
            if(!instance.exists()){
                throw new Error(`cannot find instance of '${ type }' with id '${ instanceId }'`)
            }
            var listeners = onChange ? [onChange] : [];
            function update(e){
                var currentData = e.data.currentData;
                if(currentData){
                    listeners.map(l => l(currentData.value));
                }
            }
            var watchers = this.select('watchers');
            var id = core.uuid();
            var watcher = {
                id: id,
                type: type,
                instance: instanceId,
                get(){
                    return plugin.select(['instances', { type: type, id: instanceId }]).get('value')
                },
                set(value){
                    plugin.select(['instances', { type: type, id: instanceId }]).set('value', value);
                },
                onChange(cb){
                    listeners.push(cb);
                },
                kill(){
                    var instance = plugin.select(['instances', { type: type, id: instanceId }]);
                    instance.off('update', update);
                    var watcherExists;
                    var empty = true;
                    watchers.set(watchers.get().filter(w => {
                        if(w.id === id) {
                            watcherExists = true;
                            return false;
                        }
                        
                        if((w.type === type) && (w.instance === instanceId)){
                            console.log('not empty', instanceId);
                            empty = false;
                        }
                        return true;
                    }));
                    if(!watcherExists){
                        throw new Error(`cannot find watcher with id ${ id } to kill`)
                    }
                    if(empty){
                        instance.unset();
                        // instance.set('watched', false);
                        // instance.set('hiddenSince', new Date().getTime());
                    }
                }
            }

            core.extend({
                asset(type, id){
                    return plugin.getInstance(type, id);
                }
            });
            // instance.set('watched', true);
            instance.on('update', update);
            watchers.push(watcher);
            return watcher;
        }        
      };

      function garbageCollect(){
          var now = new Date().getTime();
          var instances = plugin.get('instances');
          var filtered = instances.filter(instance => {
            return (!instance.watched && ((instance.hiddenSince) - now > 1000));
          });
          if(filtered.length < instances.length){
            plugin.set('instances', filtered);
          }
      }

    //   setInterval(garbageCollect, 1000)

      done(plugin);
  }
};