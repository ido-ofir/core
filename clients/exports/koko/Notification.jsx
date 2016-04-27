var React = require('react');
import { Alert } from 'react-bootstrap';
// var theme = require('../theme/theme.js').Theme;

var styles = {
  alert: {
    position: 'absolute',
    width: 350,
    minHeight:100,
    bottom: 20,
    left: 20,
    zIndex: 9999,
    color:'#fff',
    // fontFamily: theme['fonts'].fontFamily,
    border:0,
    fontWeight:'400',
    // boxShadow: theme['shadow'],
    background: '#888',
    transform: 'translateX(-370px)',
    WebkitTransform: 'translateX(-370px)',
    transition:'transform 0.25s ease',
    WebkitTransition:'-webkit-transform 0.25s ease',
  }
};

var types = {
  "danger": "rgb(207, 60, 62)",
  "warning": "rgb(42, 54, 64)",
  "success": "rgb(86, 182, 49)",
  "info": "rgb(0, 133, 194)"
}

const Notification = React.createClass({

  getInitialState() {
    return {
      title: '',
      text: '',
      alertKind: 'danger',
      isOpen: false,
      isVisible: false
    };
  },

  open(title, text, alertKind, timer){   // alertKind: one of "success", "warning", "danger", "info", "default", "primary"
    if(!alertKind) alertKind = 'warning';
    if(!timer) timer = 5000;
    if(!title) return console.error('Notification was called without any text');
    if(!text) text = '';
    if (typeof text === 'string')
      text = text.substring(0, 150);

    this.setState({
      title: title || '',
      text: text || '',
      alertKind: alertKind,
      isOpen: true
    });
    setTimeout(()=> {
      this.setState({
        isVisible: true
      });

    }, 100);
    setTimeout(()=> { this.hide(); }, timer);
  },

  hide(){
    if(!this.isMounted()) return;
    this.setState({
      isVisible: false
    });
    setTimeout(()=> {
      this.setState({
        isOpen: false
      });
    }, 500);
  },

  render() {
    if(!this.state.isOpen) return null;
    var tran = this.state.isVisible ? 'translateX(0px)' : 'translateX(-370px)';
    var transitionAlert = {
      ...styles.alert,
      WebkitTransform: tran,
      transform: tran
    };
    var bg = types[this.state.alertKind];
    if(bg) transitionAlert.background = bg;
      return (
        <Alert style= {transitionAlert}  onDismiss={ this.hide }>
          <h4>{ this.state.title}</h4>
          <p>{this.state.text}</p>
        </Alert>
      );
  }
});

module.exports = Notification;
