
var utils = require('./utils.js');

module.exports = {
  name: 'core.actions',
  dependencies: [
    'core.getDefinitionObject',
    'core.build',
    'core.imports',
  ],
  types: [
    require('./type.js')
  ],
  extend: {
    actions: {},
    Action(name, dependencies, get) {
      var definition = this.getDefinitionObject(name, dependencies, get, 'action');
      return this.build(definition);
    },
    run(name, data, promise) {
      // console.log(new Error(name));
      var action = this.actions[name];
      if (!action) throw new Error(`cannot find action '${name}'`);
      if (!data) data = {};
      var defered = promise || this.imports.q.defer();
      utils.validateSchema(action.schema, this.nativeTypes, data, action.name);
      action.run.call(this, data, defered);
      return defered.promise;
    },
  }
};