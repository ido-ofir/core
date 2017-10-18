module.exports = {
  $_type: 'plugin',
  name: 'asset',
  state: {
      types: [],
      instances: [],
      watchers: []
  },
  
  init(def, done){

      var core = this;

      var types = [];
      var instances = [];
      var watchers = [];

      function match(a, b){
        for(var m in a){
            if(a[m] !== b[m]){ return false; }
        }
        return true;
      }

      function find(array, selector){
        for(var i = 0; i < array.length; i++){
            if(match(selector, array[i])){ 
                return { exists: true, index: i, value: array[i] };
            }
        }
        return { exists: false, value: null, index: -1 };
      }

      function collect(array, selector){
        var result = []; 
        for(var i = 0; i < array.length; i++){
            if(match(selector, array[i])){ 
                result.push(array[i]);
            }
        }
        return result;
      }

      var plugin = {
        get(){ 
            return { types, instances, watchers };
        },
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
            var existing = find(types, { id: type.id });
            if(existing.exists){
                console.warn(`asset type '${ type.id }' already exists, overriding..`);
                types[existing.index] = type;
            }
            else{
                types.push(type);
            }
        },
        getInstance(type, id){
            return find(instances, { type: type, id: id }).value;
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
            if(!find(types, { type }).exists){
                throw new Error(`cannot find asset type '${ type }'`)
            }
            var { type, id } = instance;
            instance = core.assign({}, instance, {
                get(){
                    var item = find(instances, { type, id });
                    if(!item.exists){
                        throw new Error(`cannot get asset instance, instance '${ id }' of type '${ type }' is missing.`);
                    }
                    return item.value;
                },
                set(value){
                    var item = find(instances, { type, id });
                    if(!item.exists){
                        throw new Error(`cannot set asset instance, instance '${ id }' of type '${ type }' is missing.`);
                    }
                    instances[item.index] = value;
                    collect(watchers, { instance: id }).map(watcher => watcher.update(value));
                }
            });
            
            var { exists, value } = find(instances, { id });
            if(exists){
                value.set(instance);
            }
            else{
                instances.push(instance);
            }
            return instance;
        },
        watch(type, instanceId, onChange){
            var instance = find(instances, { type: type, id: instanceId });
            if(!instance.exists){
                throw new Error(`cannot find instance of '${ type }' with id '${ instanceId }'`)
            }
            var listeners = onChange ? [onChange] : [];
            var id = core.uuid();
            var watcher = {
                id: id,
                type: type,
                instance: instanceId,
                get(){
                    var match = find(instances, { type: type, id: instanceId });
                    if(!match.exists){
                        return null;
                    }
                    return match.value.value;
                },
                set(value){
                    var instance = find(instances, { type: type, id: instanceId });
                    if(!instance.exists){
                        throw new Error(`cannot find instance of '${ type }' with id '${ instanceId }' to set form watcher`)
                    }
                    instance.set(value);
                },
                update(value){
                    listeners.map(listener => listener(value));
                },
                onChange(cb){
                    listeners.push(cb);
                },
                kill(){
                    var instance = find(instances, { type: type, id: instanceId });
                    var watcherExists;
                    var empty = true;
                    watchers = watchers.filter(w => {
                        if(w.id === id) {
                            watcherExists = true;
                            return false;
                        }
                        if((w.type === type) && (w.instance === instanceId)){
                            console.log('not empty', instanceId);
                            empty = false;
                        }
                        return true;
                    });
                    if(!watcherExists){
                        throw new Error(`cannot find watcher with id ${ id } to kill`)
                    }
                    if(empty){
                        instances = instances.filter(i => i.id !== instanceId);
                        listeners.length = 0;
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