
module.exports = [{
  $_type: 'action',
  name: 'setSource',
  schema: {
    'source': 'any',
    'path': 'array'
  },
  dependencies: [],
  get(){
      return ({ source, path }) => {
        console.log('1');
        
        var sourcePath = path ? [ ...path ] : [];
        sourcePath.unshift('source');

        console.log(sourcePath, source);
        this.set(sourcePath, source);
        this.editedApp.update(path, source);
        // console.log('setSource', { source, path });
      }
  }
},{
  $_type: 'action',
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
}];
