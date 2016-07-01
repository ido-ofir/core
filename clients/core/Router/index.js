
var React = require('react');
var PropTypes = React.PropTypes;

var pure = require('./pure.js');
var Route = require('./Route.js');

// find 'name' in 'map.children', if not found return the default route
function getChildMap(name, map){
  name = name.toLowerCase();
  var defaultive = null;
  var children = map.children;
  if(!name || !children) return null;
  for (var i = 0; i < children.length; i++) {
    if(children[i].name === name) return children[i];
    if(children[i].name === map.defaultChild) defaultive = children[i];
  }
  console.warn(`invalid route ${name}, defaulting to ${defaultive}`)
  return defaultive;
}


/*
  creates a route object:
  {
    name: 'friends',  // the name that appears in the address bar.
    type: 'Friends',  // the name of the component to render.
    children: [],     // nested route objects.
    view: true        // render using a 'core.View' higher order.
  }
*/
function makeRoute(urlArray, parentMap) {
  if(!urlArray.length) return null;
  var name = urlArray.shift();
  var route = {};
  if(parentMap){  // restricted routes
    var map = getChildMap(name, parentMap);
    if(map){
      route.name = map.name;
      route.type = map.component;
      if(!urlArray.length && map.defaultChild){
        urlArray.push(map.defaultChild);
      }
    }
    else {
      route.name =  name;
      route.type = name;
    }
  }
  else{  // freestyle
    map = null;
    route.name = name;
    route.type = name;
  }
  route.children = urlArray.length ? [ makeRoute(urlArray, route) ] : [];
  return route;
}

module.exports = function(core){

  var routerCursor = core.tree.select(['core', 'router']);

  // sets the hash in the browser's address bar to match the router's route and query.
  // then emits the 'navigation' event.
  function setRoute(){
    var hash = location.hash.substr(1);
    var route = routerCursor.get('route');
    var query = routerCursor.get('query');
    var newHash = pure.routeToUrl(route, query);
    if(newHash !== hash){  // fix url in address bar
      history.replaceState(null, null, '#' + newHash);
    }
    core.emit('navigation', routerCursor.get())
  }

  // whenever the router tree changes, the address bar is changed to match.
  routerCursor.on('update', setRoute);

  // parses the hash in the browser's address bar whenever it changes.
  // the results are compared to the existing router state and changes are commited to the tree.
  function onHashChange(){

    console.log('hash');
    var hash = location.hash.substr(1);
    var queryStart = hash.indexOf('{');
    var urlArray, urlString, queryString;
    var route, newRoute, oldRoute = routerCursor.get('route');
    var query, newQuery, oldQuery = routerCursor.get('query');
    var map = routerCursor.get('map');
    if(queryStart > -1){
      try{
        urlString = hash.slice(0, queryStart);
        queryString = hash.slice(queryStart);
        newQuery = JSON.parse(queryString);
      }
      catch(err){ console.error(err); return; }
    }
    else{
      urlString = hash;
      newQuery = {};
    }
    urlArray = urlString.split('/').filter(n => n);
    newRoute = makeRoute(urlArray, map);
    if(!newRoute || !newRoute.type){
      return (location.hash = routerCursor.get('home'));
    }
    route = core.utils.immutableMerge(oldRoute, newRoute)
    query = core.utils.immutableMerge(oldQuery, newQuery)
    routerCursor.set('route', route);
    routerCursor.set('query', query);
    console.log('set');
  }

  function renderRoute(route, query, id) {
    if(!route || !route.type) return null;
    var component = core.components[route.type];
    if(!component) {
      console.error(`cannot find component ${route.type}`);
      return null;
    }
    var children = route.children || [];
    var props = { key: id, route: route, ...query };
    return React.createElement(component, props, children.map((child, i)=>{
      return renderRoute(child, `${id}.${i}`);
    }));
  }

  var Router = core.Component('core.Router', {
    bindings: {
      router: ['core', 'router']
    },
    render(){
      console.log('render router');
      var { route, query } = this.state.router;
      console.log(route, query);
      return renderRoute(route, query, '0')
    }
  });

  return {
    on(){
      window.addEventListener('hashchange', onHashChange);
      onHashChange();
    },
    off(){
      window.removeEventListener('hashchange', onHashChange);
    },
    set(path, value){
      var query = routerCursor.get('query');
      var route = routerCursor.get('route');
      query = core.utils.set(query, path, value);
      hash = pure.routeToUrl(route, query);
      location.hash = hash;
    },
    get(path){
      if(core.isString(path)){ path = path.split('.'); }
      return core.tree.get(path);
    },
    render(){
      return React.createElement(Router)
    }
  };
};
