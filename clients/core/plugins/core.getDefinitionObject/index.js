

function getDefinitionObject(name, dependencies, get, type) {
  if (!name) throw new Error(`${type} must have a name`);
  var definition;
  if (this.isObject(name)) {
    definition = name;
  } else {
    if (get) {
      definition = {
        name: name,
        dependencies: dependencies,
        get: get
      };
    } else {
      definition = {
        name: name,
        dependencies: [],
        value: dependencies,
      };
    }
  }
  definition.$_type = type;
  return definition;
}

module.exports = {
  name: 'core.getDefinitionObject',
  init(defintion, done) {
    this.extend({
      getDefinitionObject: getDefinitionObject
    });
    done(getDefinitionObject.bind(this));
  }
};