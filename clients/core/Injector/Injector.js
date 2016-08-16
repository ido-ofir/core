
/***

var myList = {};

var injector = Injector((name, method, dependencies)=>{
  myList[name] = method.apply(null, dependencies);
});

injector.load('koko', [], ()=>{ return 5; }, ()=>{ // ..koko was loaded })
injector.load('loko', ['koko'], (koko)=>{ return koko + 3; })

myList.koko;      // 5
myList.loko;      // 8

***/

module.exports = function Injector(constructed){

  var modules = {};             // all loaded modules.
  var paths = {};
  var pathToSet = null;

  var lists = {
    delayed: [],
    requires: [],
    resolved: [],
    paths: []
  };

  var contexts = {
    orphand: {}
  };

  var activeContext = contexts.orphand;

  function loadContext(name, contextRequire){

    if(!contextRequire){
      contextRequire = name;
      name = 'orphand';
    }
    if(!contexts[name]) contexts[name] = {};
    activeContext = contexts[name];
    contextRequire.keys().map((path)=>{
      if(path.indexOf('@') > -1) return;
      pathToSet = path;
      contextRequire(path)
    });
  }


  function testAndRun(listName, run) {

      var dependency,
          dependencies,
          hasAllDependencies,
          ready = [];

          // if(listName === 'requires') {
          //   console.log('testAndRun', listName, lists[listName]);
          // }

      var lastLength = lists[listName].length;

      lists[listName] = lists[listName].filter(function(item){
          dependencies = [],
          hasAllDependencies = true;
          for(var i = 0; i < item.dependencies.length; i++){
              dependency = item.dependencies[i];
              if(dependency){
                  if(!modules[dependency]) {
                      hasAllDependencies = false;
                      break;
                  }
                  else{
                      dependencies.push(modules[dependency]);
                  }
              }

          }
          if(hasAllDependencies){
              ready.push({ item: item, dependencies: dependencies });
              lists.resolved.push(item);

              return false;
          }
          return true;
      });

      ready.map(r => run(r.item, r.dependencies))

      if(lastLength !== lists[listName].length){   // if something has chaged, test again..
        testAndRun(listName, run);
      }
  }

  function runModule(item, dependencies){
    if(notUnique(item.name)) return;
    var constructedModule = item.method.apply(null, dependencies);
    modules[item.name] = constructedModule;
    if(constructed){
      constructed(constructedModule, item, dependencies);
    }
  }

  function runRequire(item, dependecies){
    item.cb.apply(null, dependecies);
  }

  function test(){
    if(lists.delayed.length){
      testAndRun('delayed', runModule);
    }
    if(lists.requires.length){
      testAndRun('requires', runRequire);
    }
  }

  function findMissingDependencies(){
    var dependency, missing = {};
    var existing = Object.keys(modules).concat(lists.delayed.map((d)=>{ return d.name; }));
    lists.delayed.forEach((item)=>{

      for (var i = 0; i < item.dependencies.length; i++) {
        dependency = item.dependencies[i];
        // console.log(dependency, existing.indexOf(dependency));
        if(existing.indexOf(dependency) === -1){
          if(missing[dependency]){
            missing[dependency].push(item.name);
          }
          else missing[dependency] = [item.name];
        }
      }

    });
    lists.requires.forEach((item)=>{
      for (var i = 0; i < item.dependencies.length; i++) {
        dependency = item.dependencies[i];
        // console.log(dependency, existing.indexOf(dependency));
        if(existing.indexOf(dependency) === -1){
          if(missing[dependency]){
            missing[dependency].push('a require call');
          }
          else missing[dependency] = ['a require call'];
        }
      }
    });
    return missing;
  }

  function setPath(name){
    if(pathToSet){
      paths[name] = pathToSet;
      pathToSet = null;
    }
  }

  function notUnique(name){
    if(modules[name]){
        console.error(`there is more than one module called '${name}', module names must be unique..`);
        return true;
    }
  }

  setTimeout(function(){
    if(lists.delayed.length || lists.requires.length) {
      var missing = findMissingDependencies();
      console.error(`core cannot find modules:`);
      for(var m in missing){
        console.debug('%o', m)
        console.debug('required by', missing[m])
      }

    }
  }, 200);

  return {
    lists: lists,
    resolved: lists.resolved,
    modules: modules,
    contexts: contexts,
    load(name, dependencies, method){
      // console.log('loading', name);
      if(activeContext && pathToSet){
        activeContext[name] = pathToSet;
      }
      var composedModule;
      if(notUnique(name)) return;

      if(Array.isArray(dependencies) && method instanceof Function){   // normal call with array of dependencies and callback.

        if(dependencies.length){             // lwe need some dependencies, so register the callback.
          lists.delayed.push({
              name: name,
              dependencies: dependencies,
              method: method
          });
        }
        else{                              // no dependecies - load sync.
          composedModule = method();
          this.add(name, composedModule);
        }
      }
      else if(!method){                    // shorthand call with no dependecies and no callback - load sync.
        composedModule = dependencies;
        this.add(name, composedModule);
      }
      else{
        console.error(`cannot load module definition from ${typeof method}:`);
        console.debug(method);
      }
      setPath(name);
      test();
      return modules[name];
    },
    add(name, module){
      if(notUnique(name)) return;
      modules[name] = module;
      setPath(name);
      test();
      return module;
    },
    require(dependency, cb){
      var dependencies = Array.isArray(dependency) ? dependency : [dependency];
      lists.requires.push({
        dependencies: dependencies,
        cb: cb
      });
      test();
    },
    getDependencies(name){
      for (var i = 0; i < lists.resolved.length; i++) {
        if(lists.resolved[i].name === name){
          return lists.resolved[i].dependencies;
        }
      }
      return [];
    },
    getDependents(name){
      var item, dependency;
      var dependents = [];
      for (var i = 0; i < lists.resolved.length; i++) {
        item = lists.resolved[i];
        if((item.dependencies.indexOf(name) > -1) && (dependents.indexOf(item.name) === -1)){
          dependents.push(item.name);
        }
      }
      return dependents;
    },
    setPath(path){
      pathToSet = path;
    },
    getPaths(){
      return { ...paths };
    },
    loadContext: loadContext,
    notUnique: notUnique
  };
}
