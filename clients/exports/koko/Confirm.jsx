var React = require('react');
var PropTypes = React.PropTypes;
import { Button } from 'react-bootstrap';



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
    borderRadius:'4px',
    minWidth: '250px',
    padding:'0 0 15px 0'
  },
  btnsWrap: {
    display: 'flex',
    justifyContent:'flex-end',
    flexDirection: 'row',
    padding:'0 10px'
  },
  header : {
    backgroundColor:"#d75452",
    padding:"0 10px",
    display:"flex",
    height: 35,
    color:"#fff",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    borderTopLeftRadius:"4px",
    borderTopRightRadius:"4px"
  },
  body : {
    display: "flex",
    padding: "0 10px ",
    backgroundColor:"#fff"
  },
  btns: {
    outline: 0,
    border: "1px solid #0099cc",
    width:"90px",
    height:"30px",
    borderRadius:"4px",
    fontSize:"12px",
    textTransform:"uppercase",
    lineHeight:"normal"
  }
};
var Confirm = React.createClass({
  contextTypes: {
    app: PropTypes.object
  },
  getInitialState(){
    return  {
      isOpen: false,
      isVisible: false,
      msg: '',
      ok: null,
      cancel: null,
      proposed: 'ok'
    };
  },
  open(title, msg, ok, cancel){
    if(!msg) msg = '';
    else if(msg instanceof Function){
      cancel = ok;
      ok = msg;
    }
    this.setState({
      isOpen: true,
      msg: msg,
      title: title,
      ok: ok,
      cancel: cancel
    });
  },
  close(){
    this.setState({
      isOpen: false,
      msg: '',
      title: '',
      ok: null,
      cancel: null
    });
  },
  ok(){
    var ok = this.state.ok;
    this.close();
    if(ok instanceof Function) ok();
  },
  cancel(){
    var cancel = this.state.cancel;
    this.close();
    if(cancel instanceof Function) cancel();
  },
  render: function() {
    if(!this.state.isOpen) return null;
    var wrapper = { ...styles.wrapper }
    var theme = this.context.app.theme.get;
    return (
      <div style={ wrapper }>
        <div style={{ ...styles.box, backgroundColor: theme('colors.default'), boxShadow: theme('shadow'), maxHeight: '90%', overflow: 'auto' }}>

          <div style={ {marginBottom:'10px', ...styles.header } }>
            <div>
              <span className="icon-error" style={ { fontSize:'12px' } }  ></span>
              <span style={ { fontSize:'14px', marginLeft:'10px' } }>Caution!</span>
            </div>
            <span className="icon-close-large" style={ { fontSize:'10px', cursor:'pointer' } } onClick={ this.cancel } ></span>
          </div>
          <div style={ {padding: '10px 16px 0'} }>
            <div style={ { ...styles.body, fontWeight:'700', marginBottom:'5px'} }>{ this.state.title }</div>
            <div style={ styles.body }>{ this.state.msg }</div>
          </div>
          <div style={ {...styles.btnsWrap, marginTop:'25px'} }>
            <button style={ {...styles.btns, background: theme('colors.default'), color: theme('colors.secondary'), marginRight: '10px' } }  onClick={ this.cancel }>
                  Cancel
            </button>
            <button style={ { ...styles.btns, background: theme('colors.secondary'), color: theme('colors.default') } }  onClick={ this.ok }>
                  Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Confirm;









/*


var React = require('react');
var PropTypes = React.PropTypes;
import { Button } from 'react-bootstrap';

var styles = {
  wrapper:{
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: 'flex',
    zIndex: 12,
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
    padding: '0 10px 20px 10px'
  },
  btns: {
    display: 'flex',
  },
  btn: {
    flex: 1
  }
};
var Confirm = React.createClass({
  getInitialState(){
    return  {
      isOpen: false,
      isVisible: false,
      msg: '',
      ok: null,
      cancel: null,
      proposed: 'ok'
    };
  },
  open(msg, ok, cancel){
    if(!msg) throw new Error('no message provided');
    this.setState({
      isOpen: true,
      msg: msg,
      ok: ok,
      cancel: cancel
    });
  },
  close(){
    this.setState({
      isOpen: false,
      msg: '',
      ok: null,
      cancel: null
    });
    // setTimeout(function () {
    //   this.setState({
    //     isOpen: false
    //   });
    // }, 500);
  },
  ok(){
    var ok = this.state.ok;
    this.close();
    if(ok instanceof Function) ok();
  },
  cancel(){
    var cancel = this.state.cancel;
    this.close();
    if(cancel instanceof Function) cancel();
  },
  render: function() {
    if(!this.state.isOpen) return null;
    var wrapper = { ...styles.wrapper }
    return (
      <div style={ wrapper }>
        <div style={ styles.box }>
          <div style={ styles.content }>{ this.state.msg }</div>
          <div style={ styles.btns }>
            <button style={ { ...styles.btn, marginRight: '10px'} } className={ `btn btn-${(this.state.proposed === 'ok' ? 'info' : 'default')}`} onClick={ this.ok }>
                  Ok
            </button>
            <button style={ styles.btn } className={ `btn btn-${(this.state.proposed === 'cancel' ? 'info' : 'default')}`} onClick={ this.cancel }>
                  Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Confirm;
*/
