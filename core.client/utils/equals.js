
// deep check for equality. caution: don't use objects with circular reference.
function equals(a, b){
  var ta = typeof a;
  var tb = typeof b;
  if(ta !== tb) return false;
  if(ta === 'object'){
    if(Array.isArray(a)){
      if(a.length !== b.length) return false;
      if(!a.length) return true;
      for (var i = 0; i < a.length; i++) {
        if(!equals(a[i], b[i])) return false;
      }
      return true;
    }
    else{
      if(Object.keys(a) !== Object.keys(b)) return false;
      for(var m in a){
        if(!equals(a[m], b[m])) return false;
      }
      return true;
    }
  }
  else{
    return a === b;
  }
}

module.exports = equals;
