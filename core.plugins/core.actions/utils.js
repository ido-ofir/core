function parseSchema(def) {
  var index, str, last, array;
  if (typeof def === 'string') {
    str = def;
    def = {
      types: [],
      required: false,
      description: ''
    };
    array = str.split(':');
    if (array[1]) {
      def.description = array[1].trim();
    }
    str = array[0];
    index = str.indexOf('!');
    if (index > -1) {
      def.required = true;
      str = str.split('!')[0];
    }
    def.types = str.split('~').map(t => t.trim());
    if (def.types.length === 1) {
      def.type = def.types[0];
    }
  } else {
    if (!def.types) {
      def.types = [def.type];
    }
  }
  return def;
}

function typeOf(thing, types) {
  for (var type in types) {
    if (types[type](thing)) return type;
  }
}

function validateSchema(schema, types, params, actionName) {
  var name, i, param, passed, type, valid;
  if (!params) params = {};
  for (name in schema) { // validate required params and param types.
    param = parseSchema(schema[name]);
    if (param.required) { // if it's required and missing - fail.
      if (!(name in params)) {
        throw new Error(`required ${param.type || param.types[0]} param '${name}' is missing in action '${actionName}'`);
      }
      if (param.types.indexOf('any') > -1) continue; // if was 'any!' skip the type validation.
    }
    passed = false;
    for (i = 0; i < param.types.length; i++) {
      type = param.types[i];
      if (!types[type]) {
        throw new Error(`unknown type '${type}' in action '${actionName}'`);
      }
      if (name in params) { // validate the type of param.
        valid = types[type](params[name]);
        if (valid) {
          passed = true;
        }
      } else {
        passed = true;
      }
    }
    if (!passed) {
      if (param.types.length > 1) {
        throw new Error(`parameter '${name}' in action '${actionName}' should be one of ${ param.types }. but it is a ${ typeOf(params[name], types) }`);
      }
      throw new Error(`parameter '${name}' in action '${actionName}' should be a ${ param.types[0] }. but it is a ${ typeOf(params[name], types) }`);
    }
  }
  return schema;
}

module.exports = {
    validateSchema: validateSchema,
    parseSchema: parseSchema,
    typeOf: typeOf,
};