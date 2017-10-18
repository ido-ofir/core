
module.exports = {
    name: 'core.bequeath',
    extend:{
        bequeath(definition, options) {

        // create an object that inherits from this.
        // bind functions on definition to new object.
        // for each key in 'options.inherit', the new object will have
        // a property that inherits from this[key].

        if (!options) options = {};
        var inherit = options.inherit || [];
        var child = Object.create(this);
        for (var m in definition) {
          if (this[m] && inherit.indexOf(m) > -1) { // bequeath properties to child.
            child[m] = Object.create(this[m]);
          } else {
            if (this.isFunction(definition[m])) {
              child[m] = definition[m].bind(child);
            } else {
              child[m] = definition[m];
            }
          }
        }
        return child;
      }
    }
};