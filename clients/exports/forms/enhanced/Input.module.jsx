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
  left: '-6px',
  top: '-2px',
  color: 'red',
};

 module.exports = core.Component('Input', {
   mixins: [inputMixin],
   statics: {
     mixin: inputMixin
   },

   getInitialState(){
     return {
       debouncing: false,
       value: ''
     };
   },

   propTypes: {
     name: PropTypes.string.isRequired,
     required: PropTypes.any,
     placeholder: PropTypes.string,
     validations: PropTypes.object,
     label: PropTypes.string,
     style: PropTypes.object,
     inputStyle: PropTypes.object,
     errorStyle: PropTypes.object,
     disabled: PropTypes.bool,
     onChange: PropTypes.func
   },

   handleOnChange(e){
     var value = e.target.value;
     this.debounce(value);
   },

   update(value){
     this.setState({
       debouncing: false
     });
     this.context.form.setInputValue(this.props.name, value);
     if(this.props.onChange) this.props.onChange(value);
   },

   debounce(value){   // debounce to save on form validations
     this.updatedAt = new Date().getTime();
     this.setState({
       value: value,
       debouncing: true
     });
     setTimeout(()=> {
       if((new Date().getTime() - this.updatedAt) > 99){
         this.update(value);
       }
     }, 101);
   },

   renderRequired(){
     if (this.props.required){
       return (
         <span style={ this.props.requiredStyle || requiredStyle}>*</span>
       );
     }
   },

   renderError(){

     if(!this.state.error || this.props.disabled) return null;

     return (
       <span style={ this.props.errorStyle || errorStyle } className='icon-error'>
           { ' ' + this.state.error }
       </span>
     );
   },

   render() {
    var value = this.state.debouncing ? this.state.value : this.context.form.getInputValue(this.props.name);
    var type = this.props.type || 'text';

    var style = {position: 'relative', ...this.props.style };
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
      id: this.id,
      disabled: this.props.disabled || false,
    };



     if(this.state.feedback) props.bsStyle = this.state.feedback;

     else props.bsStyle = null;

     var element = React.createElement(Input, props);

     return (
      <div style={ style }>

        { element }

        { this.renderError() }
        {this.renderRequired()}
      </div>
     );
   }
 });
