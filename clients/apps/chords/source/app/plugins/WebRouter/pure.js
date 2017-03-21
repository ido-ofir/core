

function lookup(object, name){
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
  try {
    return JSON.stringify(object);
  } catch (e) {
      console.error(e);
      return '';
  }
}

function routeToString(route){
  if(!route || !route.name) return '';
  var string = [route.name];
  var child = routeToString(route.children[0]);
  if(child) string.push('/', child);
  return string.join('');
}

function routeToUrl(route, query){
  var url = routeToString(route);
  var path = ['/', url];
  if(url){
    path.push('/');
  }
  if(query){
    if(Object.keys(query).length){
      path.push(parseObjectToUrl(query));
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
