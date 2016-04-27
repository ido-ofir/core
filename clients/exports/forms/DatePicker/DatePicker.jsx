var React = require('react');
var PropTypes = React.PropTypes;
var DatePicker = require('react-datepicker');
var moment = require('moment');
require('react-datepicker/dist/react-datepicker.css');
var inputMixin = require('../mixins/input.jsx');
var myCss = require('./date-style.css');

var errorStyle = {
    position: 'absolute',
    fontSize: '12px',
    left: 0,
    // right: 0,
    bottom:-20,
    color: 'red',
    textAlign: 'left'
};

var datePickerStyle = {
  position: 'relative',
  width: '100%'
};

var requiredStyle = {
  position: 'absolute',
  width: 10,
  fontSize: '14px',
  left: '-10px',
  top: '-2px',
  color: 'red',
};

var labelStyle = {
  fontWeight: 400,
  fontSize: 14,
  marginBottom:'5px',
  color: '#374650'
};

var value;

 module.exports = React.createClass({
   mixins: [inputMixin],

   propTypes: {
     name: PropTypes.string.isRequired,
     required: PropTypes.string,
     selected: PropTypes.object,
     minDate: PropTypes.object,
     maxDate: PropTypes.object,
     excludeDates: PropTypes.array,
     includeDates: PropTypes.array,
     placeholderText: PropTypes.string,
     label: PropTypes.string,
     disabled: PropTypes.bool,
     isClearable: PropTypes.bool,
     inputStyle: PropTypes.object
   },

   getDefaultProps () {
     return {
       minDate: moment(),
       maxDate: null,
       excludeDates: null,
       includeDates: null,
       placeholderText: null,
       disabled: false,
       isClearable: false
     }
   },

   getInitialState(){
      return {
          className: 'date-style'
        };
      },

   renderRequired(){
     if (this.props.required){
       return (
         <span style={requiredStyle}>*</span>
       );
     }
   },

   renderError(){
     if(!this.state.error) return null;
     return (
       <div style={ errorStyle }>
           { this.state.error }
       </div>
     );
   },

   handleOnChange(value){
     if(value && this.props.required){
       this.setState({className: 'success-in-date'});
     } else { this.setState({className: 'focus-in-date'});}

     if (value) {
       this.context.form.setInputValue(this.props.name, value.toISOString());
     } else {
       if(this.props.required) this.setState({className: 'error-in-date'});
       this.context.form.setInputValue(this.props.name, '');
     }
   },

   changeStyleOnBlur() {
       if (this.context.form.getInputValue(this.props.name) || !this.props.required)
          this.setState({className: 'date-style'});
       else if (this.props.required) {
           this.setState({className: 'date-error-on-blur'});
           this.setState({error: this.props.required});
       }
    },

   render() {
    var myDate= this.context.form.getInputValue(this.props.name);
    if (myDate) value= moment(new Date(myDate));
    else value= null;

    var dateStyle= {
      ...datePickerStyle,
      ...this.props.style
    };
    var iconStyle = {
      position:'absolute',
      width: '20px',
      height:'36px',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      right:0,
      bottom:0,
      padding: '0 15px',
      borderLeft: '1px solid #ccc',
      fontSize:'16px',
      color:'#bbb'
    };
     return (
      <div style={ dateStyle }>
        <span style={labelStyle}>{this.props.label}</span>

        <DatePicker
          className= {this.state.className}
          name= {this.props.name}
          selected={value}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          excludeDates= {this.props.excludeDates}
          includeDates= {this.props.includeDates}
          placeholderText={this.props.placeholder}
          disabled={this.props.disabled}
          isClearable={this.props.clearable}
          weekStart='0'
          dateFormat="DD/MM/YYYY"
          onChange={this.handleOnChange}
          onBlur= {this.changeStyleOnBlur}
          style={this.props.inputStyle}
        />
      <span className="icon-calendar" style={ iconStyle }></span>
        {this.renderError()}
        {this.renderRequired()}
      </div>
     );
   }
 });
