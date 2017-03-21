module.exports = {
  name: 'action',
  recursive: true,
  schema: {
    name: {
      $_type: 'string',
      isRequired: true,
      value: ''
    },
    schema: {
      $_type: 'schema'
    },
    dependencies: {
      $_type: 'array',
      ofType: 'string',
      options: 'moduleNames'
    },
    get: {
      $_type: 'function',
      source: '() => {  }',
      compiled: 'function(){  }'
    }
  },
  build(definition){
    var { name, schema, run, get, dependencies } = definition;
    var app = this;
    function done(run) {
      // console.log('set action', name);
      app.actions[name] = {
        name: name,
        schema: schema,
        run: run,
        dependencies: dependencies
      };
    }
    if(get){
      try {
        if(!dependencies || !dependencies.length){
          done(get.call(this));
        }
        else{
          this.require(dependencies, (...modules)=>{
            done(get.apply(this, modules));
          })
        }
      } catch (e) {
        console.error('Error in action ' + name);
        console.log(name);
      }

    }
    else{
      done(run);
    }
    return definition;
  }
};
