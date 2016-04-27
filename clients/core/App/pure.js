
function findInContext(path, context){
  if(!context) return;
  var field = path.shift();
  var target = context[field];
  if(!path.length) return target;
  return findInContext(path, target);
}

function parseString(string, context){
  if(typeof string !== 'string') return string;
  var start = string.indexOf('{{');
  var end = string.indexOf('}}');
  var value;
  if(start === -1 || end === -1) return string;
  var expression = string.slice(start + 2, end).trim();
  if(expression){
    value = findInContext(expression.split('.'), context);
  }
  if(value === undefined){
    return string;
  }
  return string.slice(0, start) + value + string.slice(end + 2);
}

function parseObjectToContext(obj, context){
  var result = {};
  for(var m in obj){
    result[m] = (typeof obj[m] === 'object') ? parseObjectToContext(obj[m], context) :  parseString(obj[m], context);
  }
  return result;
}

module.exports = {
  parseAsFunction(str, args){
    var array = str.split('=>');
    var argsArray = array[0].split(',').map(n => n.trim());
    var body = array[1];
    var bodyParts = [];
    var current = [];
    var result = [];
    var part, char;
    for (var i = 0; i < body.length; i++) {
      char = body[i];
      if(char === '{'){
        bodyParts.push({ type: 'string', value: current.join('') });
        current = [];
      }
      else if(char === '}'){
        var z = bodyParts.push({ type: 'variable', value: current.filter(n => n && (n !== ' ')).join('') });
        current = [];
      }
      else{
        current.push(char);
      }
    }
    if(current.length) bodyParts.push({ type: 'string', value: current.join('') });
    // console.dir(argsArray);
    // console.dir(bodyParts);
    var a, b;
    for (var k = 0; k < bodyParts.length; k++) {
      part = bodyParts[k];
      if(part.type === 'string') result.push(part.value);
      else {
        a = argsArray.indexOf(part.value);
        result.push(args[a])
      }
    }
    return result.join('').trim();
  },
  parseObjectToContext: parseObjectToContext
};
