
var notify = require('./notify.jsx');
var alert = require('./alert.jsx');
var confirm = require('./confirm.jsx');
var overlay = require('./overlay.jsx');
var popup = require('./popup.jsx');
// var loader = require('./loader.jsx');
module.exports = {
  mixins: [notify, alert, confirm, overlay, popup]
};
