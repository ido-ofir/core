var React = require('react');
var PropTypes = React.PropTypes;

var core = require('core');
var myCss = require('./loader-theme.css');

var allScreen= {
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  position: 'absolute',
  top:0,
  bottom:0,
  left:0,
  right:0,
  zIndex: 1
}

var box = {
  position: 'absolute',
  top:0,
  bottom:0,
  left:0,
  right:0,
  zIndex: 1
};

core.Component('ui.Loader', [], ()=>{
  return {

     propTypes: {
       type: PropTypes.number,
       background: PropTypes.string, // the background of the 'allScreen' wrapper. [color in hex, or rgb] none for no background
       opacity: PropTypes.number // the opacity of the 'allScreen' wrapper.
     },

     getDefaultProps () {
       return {
         type: 1,
         background: '#FFF',
         opacity: 0.5
       }
     },

     renderLoader(){
       if (this.props.type === 1){
         return(
           <div className="spinner">
             <div className="bounce1"></div>
             <div className="bounce2"></div>
             <div className="bounce3"></div>
           </div>
         );
       }

      if (this.props.type === 2){
        return(
          <div className="sk-fading-circle">
             <div className="sk-circle1 sk-circle"></div>
             <div className="sk-circle2 sk-circle"></div>
             <div className="sk-circle3 sk-circle"></div>
             <div className="sk-circle4 sk-circle"></div>
             <div className="sk-circle5 sk-circle"></div>
             <div className="sk-circle6 sk-circle"></div>
             <div className="sk-circle7 sk-circle"></div>
             <div className="sk-circle8 sk-circle"></div>
             <div className="sk-circle9 sk-circle"></div>
             <div className="sk-circle10 sk-circle"></div>
             <div className="sk-circle11 sk-circle"></div>
             <div className="sk-circle12 sk-circle"></div>
           </div>
        );
      }

       if (this.props.type === 3){
         return(
           <div className="circle"></div>
         );
       }

     },

     render() {
       return (
         <div style={{ ...box, ...this.props.style }}> {/*small change so we can control the wrapper of the wrapper of the loader..*/}
           <div style={{ ...allScreen, background: this.props.background, opacity: this.props.opacity }}>
             { this.renderLoader() }
           </div>
         </div>
       );
     }
   };
});

{/*
  calling to <Loader /> will be like:
<Loader background="#000" style={ {width: 10px, marginLeft: 15px} } show={!this.state.data} spinner={1} />

*/}
