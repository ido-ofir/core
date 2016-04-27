module.exports = {
    length (value, length){ // var validations = {'length:3': 'alert'};
        return (value.length && value.length == length);
    },
    min (value, min) { // min number of chars
        min = parseInt(min);
        return (value && value.length && (value.length >= min));
    },
    max (value, max) { // max number of chars
        max = parseInt(max);
        if(!value) return true;
        return (value.length <= max);
    },
    enum (value) {
      return true;
    },
    integer (value) {
        var dot = -1;
        if (value) dot = value.indexOf('.');
        return (!isNaN(value) && dot === -1);
    },
    numeric (value) {
        var dot = -1;
        if (value) dot = value.indexOf('e');
        return (!isNaN(value) && dot === -1);
    },
    string (value) {
        return (value instanceof String);
    },
    equals (value, to){  // var validations = {'equals:10': 'alert'};
      return (value === to);
    },
    email: function(email){
        if(email === undefined || email === '') return true;
        return email && email.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
    },
    phone: function(phone){  // between 9 to 10 digits
        if(phone === undefined || phone === '') return true;
        return phone && phone.match(/^[0-9]{9,10}$/);
    },
    mobile: function(mobile){ // 10 digits
        if(mobile === undefined || mobile === '') return true;
        return mobile && mobile.match(/^[0-9]{10}$/);
    }
};
