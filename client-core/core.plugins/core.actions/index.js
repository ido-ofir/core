
var utils = require('./utils.js');

module.exports = {
  name: 'core.actions',
  dependencies: [
    'core.getDefinitionObject',
    'core.build',
    'core.imports',
    'core.monitor',
  ],
  /**
   * @name core.types.action
   * @description The type definition for an action.
   */
  types: [
    require('./type.js')
  ],
  extend: {
    /**
     * @name core.actions
     * @description An object to hold all actions.  
     */
    actions: {},
    /**
     * @name core.Action
     * @description Creates a new action.
     * @param definition - a definition object.
     * @param definition.name {String} - the name of the action.
     * @param definition.dependencies {Array} - dependencies used by the action.
     * @param definition.schema {Object} - a schema object that describes the action's patameters object.
     * @param definition.get - called when all dependencies are available, should return the action function. 
     */
    Action(name, dependencies, get) {

      var definition = this.getDefinitionObject(name, dependencies, get, 'action');
      return this.build(definition);
    },
    /**
     * @name core.run
     * @description Runs an action.
     * @param name {String} - the name of the action to run.
     * @param data {Object} - an object of named parameters for the action.
     * @param promise {Promise} - an optional promise to use for the action. if not supplied a new promise is created.
     * @param context {String} - optional context to use when calling the action function ( determines the value of 'this' ). if not supplied 'core' is used as the context.
     */
    run(name, data, promise, context) {

      var action = this.actions[name];
      if (!action) throw new Error(`cannot find action '${name}'`);
      if (!data) data = {};
      var defered = promise || this.imports.q.defer();
      utils.validateSchema(action.schema, this.nativeTypes, data, action.name);
      this.monitor('actions.run', { name: name, data: data });
      action.run.call(context || this, data, defered);
      return defered.promise;
    },
  }
};