var Emitter = require('../../utils/Emitter.js');
var style = {};
module.exports = window.style = Emitter({
  get(selector){
    if(!selector) return style;
    return style[selector] || {};
  },
  set(selector, obj){
    if(selector && obj){
      style[selector] = obj;
      this.emit('change', {
        selector: selector,
        style: obj
      });
    }
    else if(typeof selector === 'object') { // set the whole style
      style = selector;
      this.emit('change', {
        selector: '.',
        style: style
      });

    }
  }
});
