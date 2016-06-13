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
    zIndex: 11,
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.7)'
  },

  topLine: {
    display: 'flex',
    width: '100%',
    height: 46,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },

  box: {
    borderRadius:'4px',
    minWidth: '450px',
    padding:'0 0 15px 0'
  },

  body : {
    justifyContent:"center",
    display: "flex",
    padding: "0 10px ",
    backgroundColor:"#fff"
  },

};


const Popup = React.createClass({

  contextTypes: {
    app: PropTypes.object
  },

  childContextTypes: {
    popup: PropTypes.object
  },

  getChildContext(){
    return {
      popup: this
    };
  },

  getInitialState() {
    return {
      isOpen: false,
      isVisible: false
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

  closePopup(){
    this.close(null);
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
    }, 10);
  },

  renderTopLine(){
    var title = this.state.props.title ? this.state.props.title : "Title" ;
    var background = this.state.props.background ? this.state.props.background : '#0099cc' ;
    var color = this.state.props.color ? this.state.props.color : '#fff' ;

    var topLineStyle = {
      ...styles.topLine,
      color: color,
      textTransform:'capitalize',
      background: background
    }

    return(
      <div className="top-line" style={topLineStyle}>
         <div className="top-line-title" style={{
           display: 'flex',
           flex: 1,
           justifyContent: 'flex-start',
           alignItems: 'center',
           marginLeft: 15
         }}>
           <span style={{
             fontSize: 16,
             textTransform:'uppercase'
           }}>{title}</span>
         </div>
         <div className="top-line-X" style={{
           display: 'flex',
           flex: 1,
           justifyContent: 'flex-end',
           alignItems: 'center',
           marginRight: 15
         }}>
          <span className='fa fa-close' style={{
             fontSize: 18,
             cursor: 'pointer'
           }} onClick={this.closePopup}></span>
         </div>
       </div>
    )
  },

  render() {
    if(!this.state.isOpen) return null;

    var theme = this.context.app.theme.get;
    var props = this.state.props || {};
    var element = React.createElement(this.state.component, props);

      return (
        <div style={ styles.wrapper }>
          <div style={{ ...styles.box, backgroundColor: theme('colors.default'), boxShadow: theme('shadow') }}>
              {this.renderTopLine()}
            <div style={ {padding: '10px 0 0'} }>
              <div style={ styles.body }>{ element }</div>
            </div>
          </div>
        </div>
      );
  }
});

module.exports = Popup;
