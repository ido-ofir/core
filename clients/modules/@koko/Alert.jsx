var React = require('react');
var PropTypes = React.PropTypes;

var styles = {
  wrapper:{
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: 'flex',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.7)'
  },
  box: {
    backgroundColor:'#eee',
    borderRadius:'4px',
    padding: '25px',
    minWidth: '250px',
    boxShadow:'2px 2px 24px -8px rgba(2,2,2,0.5)',
    // transition: '0.4s ease',
    // WebkitTransition: '0.4s ease'
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px'
  },

  btn: {
    width: '100%'
  }
};
var Alert = React.createClass({
  // mixins: [log],
  getInitialState(){
    return  {
      isOpen: false,
      isVisible: false,
      msg: '',
      cb: null
    };
  },
  componentDidMount(){
    window.addEventListener('keyup', this.onKeyUp);
  },
  open(msg, cb){
    // this.log('open - ', msg);
    if(!msg) return;
    this.setState({
      isOpen: true,
      msg: msg,
      cb: cb
    });
    // setTimeout(()=> {
      // this.setState({
      //   isVisible: true
      // });
    // }, 100);
  },
  close(){
    var cb = this.state.cb;
    this.setState({
      isOpen: false,
      msg: '',
      cb: null
    });
    if(cb instanceof Function) cb();
    // setTimeout(function () {
    //   this.setState({
    //     isOpen: false
    //   });
    // }, 500);
  },
  onKeyUp(e){
    if(!this.state.isOpen) return;
    if(e.keyCode === 13) this.close();
  },
  render: function() {
    if(!this.state.isOpen) return null;
    var wrapper = { ...styles.wrapper }
    return (
      <div style={ wrapper } onKeyUp={ this.onKeyUp }>
        <div style={ styles.box }>
          <div style={ styles.content }>{ this.state.msg }</div>
          <button style={ styles.btn } bsStyle="info" onClick={ this.close }>
                Ok
          </button>
        </div>
      </div>
    );
  }

});

module.exports = Alert;
