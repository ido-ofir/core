var React = require('react');
var PropTypes = React.PropTypes;
import { Input } from 'react-bootstrap';
var inputMixin = require('./mixins/input.jsx');

var errorStyle = {
    position: 'absolute',
    fontSize: '14px',
    color: 'red',
    width: '20px',
    top: '7px',
    right: 5,
    height: '100%'
};

var requiredStyle = {
  position: 'absolute',
  width: 10,
  fontSize: '14px',
  left: '-12px',
  top: '-2px',
  color: 'red',
};

 module.exports = React.createClass({
   mixins: [inputMixin],

   propTypes: {
     name: PropTypes.string.isRequired,
     required: PropTypes.any,
     placeholder: PropTypes.string,
     validations: PropTypes.object,
     label: PropTypes.string,
     style: PropTypes.object,
     inputStyle: PropTypes.object,
     errorStyle: PropTypes.object,
     requiredStyle: PropTypes.object,
     showRequired: PropTypes.bool,
     disabled: PropTypes.bool,
     onChange: PropTypes.func,
     onEnterKey: PropTypes.func,
     showAsterisk: PropTypes.bool,
     showError: PropTypes.bool
   },

   getDefaultProps () {
     return {
       showAsterisk: true,
       showRequired: true,
       showError: true
     }
   },

   handleOnChange(e){
     var value = e.target.value;
    //  console.log(value);
     this.context.form.setInputValue(this.props.name, value);
     if(this.props.onChange) this.props.onChange(value);
    //  this.handleOnFocus();
   },

   renderRequired(){
     if (this.props.required && this.props.showAsterisk) {
       return (
         <span style={{ ...requiredStyle, ...this.props.requiredStyle }}>*</span>
       );
     }
   },
   onKeyUp(e){
     if(e.keyCode === 13){
       if(this.props.onEnterKey) this.props.onEnterKey();
     }
   },

   renderError(){

     if(!this.state.error || this.props.disabled) return null;
     if(!this.props.showError) return null;
     return (
       <span style={ this.props.errorStyle || errorStyle } className='icon-error'>
           { ' ' + this.state.error }
       </span>
     );
   },

   render() {
    var value= this.context.form.getInputValue(this.props.name);
    var type = this.props.type || 'text';

    var style = { position: 'relative', ...this.props.style };

    var inputStyle = this.props.inputStype || {};

    if(this.props.highlight && this.state.error){
      inputStyle.border = '1px solid #f00'
    }

    var props = {
      style: this.props.inputStyle,
      type: type,
      name: this.props.name,
      placeholder: this.props.placeholder,
      value: value,
      onChange: this.handleOnChange,
      label: this.props.label,
      hasFeedback:true,
      disabled: this.props.disabled || false,
      onKeyUp: this.onKeyUp
    };

     if(this.state.feedback) props.bsStyle = this.state.feedback;

     else props.bsStyle = null;

     var element = React.createElement(Input, props);

     return (
      <div className="form-input" style={ style }>
        { element }
        <span className="error">
          { this.renderError() }
        </span>
        {this.renderRequired()}
      </div>
     );
   }
 });
