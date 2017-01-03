module.exports = {
    length (length){ // var validations = {'length:3': 'alert'};
        return function(value){
          if(!(value && value.length && value.length == length)) return core.translate('core.forms.validations.length', {length: length, value: value});
        };
    },
    min (min) { // min number of chars
        min = parseInt(min);
        return function(value){
          if(!(value && value.length && (value.length >= min))) return core.translate('core.forms.validations.min', {min: min, value: value});
        };
    },
    max (max) { // max number of chars
      max = parseInt(max);
      return function(value){
        if(!value) return;
        if(value.length > max) return core.translate('core.forms.validations.max', {max: max, value: value});
      };
    },
    number () {
      return function(value){
        var dot = -1;
        if (value) dot = value.indexOf('.');
        if(isNaN(value) || dot !== -1) return core.translate('core.forms.validations.number', {value: value});
      };
    },
    string () {
      return function(value){
        if(!(value instanceof String)) return core.translate('core.forms.validations.string', {value: value});
      };
    },
    equals (to){  // var validations = {'equals:10': 'alert'};
      return function(value){
        if(value !== to) return core.translate('core.forms.validations.equals', {value: value, to: to});
      };
    },
    email(){
      return function(value){
        if(value === undefined || value === '') return;
        var valid =  value && value.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
        if(!valid) return core.translate('core.forms.validations.email', {value: value});
      };
    },
    phone(){  // between 9 to 10 digits
      return function(value){
        if(value === undefined || value === '') return null;
        var valid = value && value.match(/^[0-9]{9,10}$/);
        if(!valid) return core.translate('core.forms.validations.phone', {value: value});
      };
    },
    mobile(){ // 10 digits
      return function(value){
        if(value === undefined || value === '') return true;
        var valid = value && value.match(/^[0-9]{10}$/);
        if(!valid) return core.translate('core.forms.validations.mobile', {value: value});
      };
    }
};
