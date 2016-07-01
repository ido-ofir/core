var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
var Baobab = require('baobab');

var Notification = require('./Notification.jsx');
var Overlay = require('./Overlay.jsx');
var Alert = require('./Alert.jsx');
var Confirm = require('./Confirm.jsx');
var Popup = require('./Popup.jsx');
var mixins = require('./mixins');



var style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};

core.Component('Koko', [], ()=>{


  return {
    contextTypes: {
      app: PropTypes.object
    },
    childContextTypes: {
      koko: PropTypes.object
    },
    getChildContext(){
      return {
        koko: this
      };
    },
    componentDidMount(){
      window.koko = this;
    },
    alert(msg, cb){
      if(this.refs.alert) {
        this.refs.alert.open(msg, cb);
      }
    },
    confirm(title, msg, ok, cancel){
      if(this.refs.confirm) {
        this.refs.confirm.open(title, msg, ok, cancel);
      }
    },
    notify(title, text, alertKind, timer){
      if(this.refs.notification) this.refs.notification.open(title, text, alertKind, timer);
    },
    overlay(component, props, callback){
      if(this.refs.overlay) this.refs.overlay.open(component, props, callback);
    },
    popup(title, content, ok, cancel){
      if(this.refs.popup) this.refs.popup.open(title, content, ok, cancel);
    },
    render: function() {
      return (
        <div className="koko-wrap-1" style={ style }>
          <div className="koko-wrap-2" tyle={ { ...style, overflow: 'auto' } }>
            <div className="koko-wrap-3" style={ { ...style, overflow: 'hidden' } }>
              { this.props.children }
            </div>
          </div>
          <Overlay ref="overlay"/>
          <Popup ref="popup"/>
          <Confirm ref="confirm"/>
          <Alert ref="alert"/>
          <Notification ref="notification"/>
        </div>
      );
    }
  };
})
