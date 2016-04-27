var React = require('react');
var PropTypes = React.PropTypes;
import { Input } from 'react-bootstrap';
var inputMixin = require('./mixins/input.jsx');

var radioGroupStyle = {
  display: 'flex',
  flexDirection: 'row',
  position: "relative"
};

var requiredStyle = {
  position: 'absolute',
  width: 10,
  fontSize: '14px',
  left: '-6px',
  right: 0,
  top: '-2px',
  color: 'red',
};

 module.exports = React.createClass({
   mixins: [inputMixin],

   propTypes: {
     name: PropTypes.string.isRequired,
     required: PropTypes.string,
     options: PropTypes.array.isRequired,
     display: PropTypes.string,
     set: PropTypes.string,
     disabled: PropTypes.bool,
     style: PropTypes.object,
     itemStyle: PropTypes.object
   },

   handleOnChange(e){
     var value = e.target.value;
     this.context.form.setInputValue(this.props.name, value);
   },

   renderOption(option, v, i){
     var display = this.props.display || 'name';
     var set = this.props.set || 'id';
     var value = option[set];
     var text = option[display];
     var checked = (value === v);
     if (!text || !value) {
       console.error(`can't find ${set} or ${display} in options[]`);
       return(
         null
      );};

     return(
       <div key={ i } style={{marginLeft: i>0 ? 10 : 0, ...this.props.itemStyle }}>
         <input type="radio" name={this.props.name} value={value} onChange={this.handleOnChange}
           disabled={this.props.disabled} checked={ checked }/> {text}
       </div>
     );
   },

   renderRequired(){
     if (this.props.required){
       return (
         <span style={requiredStyle}>*</span>
       );
     }
   },

   renderOptions(options, value){
     var items = options.map((option, i)=>{
       return this.renderOption(option, value, i);
     });
     return items;
   },

   render() {
    var name= this.context.form.getInputValue(this.props.name);

     return (
      <div style={{ ...radioGroupStyle, ...this.props.style }}>
          {this.renderOptions(this.props.options, name)}
          {this.renderRequired()}
      </div>
     );
   }
 });
