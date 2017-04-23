
var core = require('core');
var source =
`
({
    $_type: 'action',
    name: 'yo',
    get(){

        return ()=>{
            alert(55);
        };

    }
});
`
var compiled =
`
(function(){

  return function(){
    alert('go');
  };

})
`;
module.exports = core.App({
  name: 'test',
  tree: {
    wow: 'asd'
  },
  components: {
    $_type: 'array',
    ofType: 'component',
    items: []
  },
  types: {
    $_type: 'array',
    ofType: 'type',
    items: []
  },
  modules: {
    $_type: 'array',
    ofType: 'module',
    items: []
  },
  actions: {
    $_type: 'array',
    ofType: 'action',
    items: [{
      $_type: 'action',
      name: {
        $_type: 'string',
        value: 'go'
      },
      get: {
        $_type: 'function',
        source: compiled,
        compiled: compiled,
      }
    }]
  },
  views: {
    $_type: 'array',
    ofType: 'view',
    items: []
  },
  templates: {
    $_type: 'array',
    ofType: 'template',
    items: []
  },
});
