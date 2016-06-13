var React = require('react');
var PropTypes = React.PropTypes;

var styles = {
  allScreen: {
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    // zIndex: 9,
    zIndex: 1000,
    transition: 'transform 0.35s ease-in-out',
    WebkitTransition:'-webkit-transform 0.35s ease-in-out',
    background: '#fff'
  }
};

const Overlay = React.createClass({

  getInitialState() {
    return {
      isOpen: false,
      isVisible: false
    };
  },

  childContextTypes: {
    overlay: PropTypes.object
  },

  getChildContext(){
    return {
      overlay: this
    };
  },

  open(component, props, callback){

    this.setState({
      component: component,
      props: props || {},
      callback: callback,
      isOpen: true
    });
    
    setTimeout(()=> {
      this.setState({
        isVisible: true
      });
    }, 100);
  },

  close(data){
    this.setState({
      isVisible: false
    });
    if(this.state.callback) this.state.callback(data);
    setTimeout(()=> {
      this.setState({
        isOpen: false
      });
    }, 500);
  },

  render() {
    if(!this.state.isOpen) return null;
    var showHide = {
      ...styles.allScreen,
      transform: (this.state.isVisible)
      ? 'translateY(0%)'
      : 'translateY(100%)',
      WebkitTransform: (this.state.isVisible)
      ? 'translateY(0%)'
      : 'translateY(100%)'
    };
    var props = this.state.props || {};
    var element = React.createElement(this.state.component, props);
    return (
      <div style={ showHide }>
        { element }
      </div>
    );
  }
});

module.exports = Overlay;
