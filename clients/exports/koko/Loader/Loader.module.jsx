var React = require('react');
var PropTypes = React.PropTypes;

var core = require('core');
var myCss = require('./loader-theme.css');

var allScreen= {
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  position: 'absolute',
  // top:0,
  bottom:0,
  left:0,
  right:0,
  opacity: 0.5,
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

core.Component('Loader', [], ()=>{
  return {

     propTypes: {
       top: PropTypes.number, // TODO: change it !
       size: PropTypes.string,
       show: PropTypes.bool,
       spinner:PropTypes.number,
       background: PropTypes.string //the background of the 'allScreen' wrapper. [color in hex, or rgb] none for no background
     },

     getDefaultProps () {
       return {
         spinner: 1,
         background: '#FFF',
         top: 0,
         show: true
       }
     },

     renderLoader(){
       allScreen = {
         ...allScreen,
         top: this.props.top
       }
       var spinnerClass = (this.props.size && this.props.size == "sm" )? "sm-spinner" : "spinner";


       if (!this.props.show){
         return(null);
       }

       if (this.props.spinner==1)
         return(
           <div style={{...allScreen, background: this.props.background}}>
             <div className={spinnerClass}>
               <div className="bounce1"></div>
               <div className="bounce2"></div>
               <div className="bounce3"></div>
             </div>
           </div>
         );
      if (this.props.spinner==2)
       return(
         <div style={{...allScreen, background: this.props.background}}>
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
         </div>
       );

       if (this.props.spinner==3)
        return(
          <div style={{...allScreen, background: this.props.background}}>
            <div className="circle"></div>
          </div>
        );
     },

     render() {
       if (!this.props.show){
         return null;
       }
       return (
         <div style={ { ...box, ...this.props.style, top: this.props.top} }> {/*small change so we can control the wrapper of the wrapper of the loader..*/}
           {this.renderLoader()}
         </div>
       );
     }
   };
});

{/*
  calling to <Loader /> will be like:
<Loader background="#000" style={ {width: 10px, marginLeft: 15px} } show={!this.state.data} spinner={1} />

*/}
