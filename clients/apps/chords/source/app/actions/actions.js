
module.exports = [{
  name: 'setSource',
  schema: {
    'source': 'object!',
    'path': 'array'
  },
  dependencies: [],
  get(){
      return ({ source, path }) => {
        console.debug("source", source, path);
        var sourcePath = path ? [ ...path ] : [];
        sourcePath.unshift('source');

        console.log('setting', sourcePath, source);
        this.set(sourcePath, source);
        this.editedApp.update(path, source);
        // console.log('setSource', { source, path });
      }
  }
},{
  // $_type: 'action',
  name: 'save',
  schema: {
    'item': 'object!',
    'code': 'string!',
    'type': 'string!'
  },
  dependencies: ['compile'],
  get(compile){
      return ({ item, code, type }) => {

          var compiledItem = { ...item, source: code, compiled: compile[type](code, `${this.editedApp.name}.${type}.${item.name}`) };
          this.run('setSource', { path: [type, { name: item.name } ], source: compiledItem });

      }
  }
},{
  name: 'test',
  $_type: 'code',
  source:
`
return {
    name: 'test',
    schema: {
        'code': 'string'
    },
    get(){

        return ()=>{
          alert(56);
        };

    }
};
`,
  compiled:
`
(function(){
return {
  name: 'test',
  schema: {
    'code': 'string'
  },
  get: function get() {

    return function () {
      alert(77);
    };
  }
};
}())
`
}];
