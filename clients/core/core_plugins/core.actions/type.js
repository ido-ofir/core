module.exports = {
    name: 'action',
    recursive: true,
    schema: {
      name: {
        type: 'string',
        isRequired: true,
        value: ''
      },
      schema: {
        type: 'schema'
      },
      dependencies: {
        type: 'array',
        ofType: 'string',
        options: 'moduleNames'
      },
      get: {
        type: 'function',
        source: '() => {  }',
        compiled: 'function(){  }'
      }
    },
    build(definition) {
      var {
        name,
        schema,
        run,
        get,
        dependencies
      } = definition;
      var core = this;

      function done(run) {
        // console.log('set action', name);
        core.actions[name] = {
          name: name,
          schema: schema,
          run: run,
          dependencies: dependencies
        };
      }
      if (get) {
        try {
          if (!dependencies || !dependencies.length) {
            done(get.call(this));
          } else {
            core.require(dependencies, (modules) => {
              modules = [].slice.call(arguments);
              done(get.apply(this, modules));
            })
          }
        } catch (e) {
          console.error('Error in action ' + name);
          console.log(name);
        }

      } else if (core.isFunction(run)) {
        done(run);
      }
      return definition;
    }
  };