var core = require('core');
var _ = require('lodash');

core.Module('FacetColor', {

    getTypeColor(type){

      // returns string for 'this.theme()' 

      switch (type.toLowerCase()) {
        case 'phone number':
          return 'colors.secondary'
          break;

        case 'url':
          return 'colors.primary'
          break;

        default:
          return 'colors.text'
          break;
      }
    },

});
