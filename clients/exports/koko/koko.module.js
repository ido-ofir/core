var core = require('core');
// var Koko = require('./Koko.jsx');
var mixins = require('./mixins');
core.Module('koko', ['Koko', 'forms'], (Koko, forms)=>{
  return {
    Koko: Koko,
    mixins: mixins,
    forms: forms
  };
});
