
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

  var modules = {};
  var dependencies = {};
  var paths = {};
  var pathToSet = null;

  var lists = {
    delayed: [],
    requires: [],
    resolved: [],
    paths: []
  };


  function testAndRun(listName, run) {

      var dependency,
          dependencies,
          hasAllDependencies;

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
              // console.log('running', item.name);
              lists.resolved.push(item);
              run(item, dependencies);
              return false;
          }
          else{
            // console.log(item.name, 'needs', item.dependencies);
          }
          return true;
      });

      if(lastLength !== lists[listName].length) testAndRun(listName, run);
  }

  function runModule(item, dependencies){
    var module = item.method.apply(null, dependencies);
    if(item.onLoad) module = item.onLoad(item.name, module, dependencies);
    if(notUnique(item.name)) return;
    modules[item.name] = module;
    constructed(module, item, dependencies);
  }
  function testModules(){
    if(!lists.delayed.length) return;
    testAndRun('delayed', runModule);
  }

  function runRequire(item, dependecies){
    item.cb.apply(null, dependecies);
  }
  function testRequires(){
    if(!lists.requires.length) return;
    testAndRun('requires', runRequire);
  }
  function test(){
    testModules();
    testRequires();
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
  }, 20);

  return {
    lists: lists,
    resolved: lists.resolved,
    modules: modules,
    load(name, dependencies, method, onLoad){
      // console.log('loading', name);
      if(notUnique(name)) return;
      lists.delayed.push({
          name: name,
          dependencies: dependencies,
          method: method,
          onLoad: onLoad
      });
      setPath(name);
      test();
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
    notUnique: notUnique
  };
}
