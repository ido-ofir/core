

function lookup(object, name, caseSensitive){
  if(!object || !name) return null;
  var defaultive = object['*'];
  name = name.toLowerCase();
  for(var m in object){
    if(m.toLowerCase() === name) return object[m];
  }
  if(defaultive){  // default route
    if(object[defaultive]) return object[defaultive];
  }
  return null;
}

function parseObjectToUrl(object) {
  if(typeof object === 'string') return object;
  if(!object) return '';
  return JSON.stringify(object);
}

function routeToString(route){
  if(!route || !route.component) return '';
  var string = [route.name];
  var child = routeToString(route.children[0]);
  if(child) string.push('/', child);
  return string.join('');
}

function routeToUrl(route){
  var url = routeToString(route);
  var path = ['/', url];
  if(route.query){
    if(Object.keys(route.query).length){
      path.push('/', JSON.stringify(route.query));
    }
  }
  return path.join('');
}



module.exports = {
  lookup: lookup,
  routeToString: routeToString,
  routeToUrl: routeToUrl,
  parseObjectToUrl: parseObjectToUrl
};
