
modules.exports = {
  name: 'webRouter',
  types: [{
    name: 'webRouter.route',
    schema: {
      $_type: 'object',
      members: [{
        $_type: 'string'
        key: 'name',
        value: ''
      }, {
        $_type: 'string',
        key: 'component',
        input: 'select',
        getOptions(){
          return this.components.map(component => component.name);
        }
      }, {
        $_type: 'array',
        key: 'children',
        of: 'webRouter.route'
      }]
    }
  }],
  config: [{
    key: 'map',
    $_type: 'array',
    of: 'webRouter.route'
  }],

};
