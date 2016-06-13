var React = require('react');
var PropTypes = React.PropTypes;
// TODO: require Loader and add a reference to this file in koko/mixins/view.jsx
var allScreen= {
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  position: 'absolute',
  top:0,
  bottom:0,
  left:0,
  right:0,
  background: '#CCC',
  opacity: 0.5,
}
var spinners = [(
  <div style={allScreen}>
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  </div>
), (
  <div style={allScreen}>
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
), (
  <div style={allScreen}>
    <div className="circle"></div>
  </div>
)];
var Loader = React.createClass({
 propTypes: {
   spinner:PropTypes.number,
 },

 getDefaultProps () {
   return {
     spinner: 0
   }
 },
 render() {
   return spinners[this.props.spinner];
 }
});

function L(comp, spinner){
  this.comp = comp;
  this.spinner = spinner || 0;
}
L.prototype = {
  render(){
    return (this.comp.state._loader ? <Loader spinner={ this.spinner }/> : null)
  },
  hide(){
    this.comp.setState({_loader: false});
  },
  show(spinner){
    this.spinner = spinner;
    this.comp.setState({_loader: true});
  }
};
var loaderMixin = {
  getInitialState(){
    this.loader = new L(this);
    return {
      _loader: false
    };
  }
};

module.exports = loaderMixin;
