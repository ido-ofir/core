var Baobab = require('baobab');
var core = require('core');

var structure = {
  collections: [],  // { name: 'cats', count: 8 }
  selectedCollection: null,
  selectedDocument: null,
  docString: '{}'
};

var tree = window.t = new Baobab(structure, {});
core.Module('mongo.tree', tree);
