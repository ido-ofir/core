var core = require('core');
// var Koko = require('./Koko.jsx');
var mixins = require('./mixins');
core.Module('koko', ['Koko'], (Koko)=>{
  return {
    Koko: Koko,
    mixins: mixins
  };
});
