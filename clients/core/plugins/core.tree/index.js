
var Baobab = require('baobab');

module.exports = {
    name: 'core.tree',
    extend: {
      tree: new Baobab({ plugins: {} }),
      set(path, value){
        return this.tree.set(path, value);
      },
      get(path){
        return this.tree.get(path);
      },
      select(path){
        return this.tree.select(path);
      }
    }
};