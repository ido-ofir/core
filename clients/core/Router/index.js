
var React = require('react');
var PropTypes = React.PropTypes;

var pure = require('./pure.js');
var RouteConsructor = require('./Route.jsx');

// find 'name' in 'map.children', if not found return the default route
function getChildMap(name, map){
  name = name.toLowerCase();
  var defaultive = null;
  var children = map.children;
  if(!name || !children) return null;
  for (var i = 0; i < children.length; i++) {
    if(children[i].name === name) return { ...children[i], index: i };
    if(children[i].name === map.defaultChild) defaultive = children[i];
  }
  if(!defaultive) {
    return null;
  }
  console.warn(`invalid route ${name}, defaulting to ${defaultive.name}`)
  return { ...defaultive, index: -1 };
}


/*
  creates a route object:
  {
    name: 'friends',  // the name that appears in the address bar.
    component: 'Friends',  // the name of the component to render.
    children: [],     // nested route objects.
  }
*/
function makeRoute(urlArray, parentMap) {
  if(!urlArray.length) return null;
  var name = urlArray.shift();
  var map, route = {};
  if(parentMap && parentMap.children){  // restricted routes
    map = getChildMap(name, parentMap);
    if(map){
      route.name = map.name;
      route.component = map.component;
      route.index = map.index;
      if(!urlArray.length && map.defaultChild){
        urlArray.push(map.defaultChild);
      }
    }
    else {
      return null;
    }
  }
  else{  // freestyle
    if(!core.components[name]) return null;
    map = null;
    route.name = name;
    route.component = name;
  }
  route.children = urlArray.length ? [ makeRoute(urlArray, map) ] : [];
  return route;
}

module.exports = function(core){

  var routerCursor = core.tree.select(['core', 'router']);
  var Route = RouteConsructor(core);

  // sets the hash in the browser's address bar to match the router's route and query.
  // then emits the 'navigation' event.
  function setRoute(){
    var hash = location.hash.substr(1);
    var route = routerCursor.get('route');
    var query = routerCursor.get('query');
    var newHash = pure.routeToUrl(route, query);
    if(routerCursor.get('encodeURI')){
      newHash = encodeURIComponent(newHash);
    }

    if(newHash !== hash){  // fix url in address bar
      history.replaceState(null, null, '#' + newHash);
    }
    core.emit('navigation', routerCursor.get())
  }

  // whenever the router tree changes, the address bar is changed to match.
  routerCursor.on('update', setRoute);

  function parseHash(hash) {
    hash = hash || '';
    var urlArray, urlString, queryString, route, query;
    var map = routerCursor.get('map');
    var encodeURI = routerCursor.get('encodeURI');
    if(encodeURI){
      hash = decodeURIComponent(hash);
    }
    var queryStart = hash.indexOf('{');
    if(queryStart > -1){
      try{
        urlString = hash.slice(0, queryStart);
        queryString = hash.slice(queryStart);
        query = JSON.parse(queryString);
      }
      catch(err){ console.error(err); return; }
    }
    else{
      urlString = hash;
      query = {};
    }
    urlArray = urlString.split('/').filter(n => n);
    route = makeRoute(urlArray, { children: map });
    return {
      route: route,
      query: query
    };
  }

  // parses the hash in the browser's address bar whenever it changes.
  // the results are compared to the existing router state and changes are commited to the tree.
  function onHashChange(e){

    var hash = location.hash.substr(1);
    var route, oldRoute = routerCursor.get('route');
    var query, oldQuery = routerCursor.get('query');
    var newState = parseHash(hash);
    if(!newState.route || !newState.route.component){
      newState = parseHash(routerCursor.get('home') || '');
    }
    route = core.utils.immutableMerge(oldRoute, newState.route)
    query = core.utils.immutableMerge(oldQuery, newState.query)
    routerCursor.set('route', route);
    routerCursor.set('query', query);
    routerCursor.set('updatedAt', new Date());


  }



  var Router = core.Component('core.router.Router', {
    bindings: {
      router: ['core', 'router']
    },
    render(){
      var { route, query } = this.state.router;
      console.debug("router render", route);
      return <Route route={ route } query={ query } id={ `0` }/>;
    }
  });



  var router = {
    on(){
      window.addEventListener('hashchange', onHashChange);
      onHashChange();
    },
    off(){
      window.removeEventListener('hashchange', onHashChange);
    },
    set(path, value){
      var query = routerCursor.get('query') || {};
      var route = routerCursor.get('route');
      var newQuery = core.utils.set(query, path, value);
      var hash = pure.routeToUrl(route, newQuery);
      location.hash = hash;
    },
    get(path){
      if(core.isString(path)){ path = path.split('.'); }
      path = ['core', 'router', 'query', ...path ];
      return core.tree.get(path);
    },
    map(map){
      core.tree.set(['core', 'router', 'map'], map);
      onHashChange();
    },
    home(home){
      core.tree.set(['core', 'router', 'home'], home);
      onHashChange();
    },
    unset(){
      var query = routerCursor.get('query');
      var route = routerCursor.get('route');
      var nextQuery = query;
      for (var i = 0; i < arguments.length; i++) {
        nextQuery = core.utils.unset(nextQuery, path);
      }
      if(nextQuery === query) { return; }  // nothing changed
      var hash = pure.routeToUrl(route, query);
      location.hash = hash;
    },
    to(path, query, id){
      var target, route = routerCursor.get('route');
      var array, newQuery = query;
      if(id){
        array = id.split('.');
        target = route;
        array.shift();
        while(array.length){
          target = target.children[array.shift()];
        }
        // newRoute = makeRoute(urlArray);
      }
    },
    render(){
      return React.createElement(Router)
    }
  };

  return router;
};
