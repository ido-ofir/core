var React = require('react');
var PropTypes = React.PropTypes;
var myCss = require('./select-style.css');
var core = require('core');

import Select from 'react-select/lib/Select.js';
import css from 'react-select/dist/react-select.css';
import merge from 'lodash/merge';
import cx from 'classnames';

var inputMixin = require('../mixins/input.jsx');

var errorStyle = {
    position: 'absolute',
    fontSize: '10px',
    left: '6px',
    right: 0,
    bottom: '-14px',
    color: 'red',
    textAlign: 'left'
};

var requiredStyle = {
  position: 'absolute',
  width: 10,
  fontSize: '14px',
  left: '-6px',
  top: '-2px',
  color: 'red',
};

var labelStyle = {
  fontWeight: 400,
  fontSize: 14,
  marginBottom:'5px',
  color: '#374650',
};

core.Component('SmartSelect', {
   mixins: [inputMixin],

   propTypes: {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    required: PropTypes.string,
    multi: PropTypes.bool,
    disable: PropTypes.bool,
    allowCreate: PropTypes.bool,
    filterOptions: PropTypes.func,
    filterOption: PropTypes.func,
    clearable: PropTypes.bool,
    placeholder: PropTypes.string,
    searchable: PropTypes.bool,
    isLoading: PropTypes.bool,
    value: PropTypes.any,
    display: PropTypes.string,
    set: PropTypes.string,
    optionRenderer: PropTypes.func,
    onSelect: PropTypes.func,
    requiredStyle: PropTypes.object,
    style: PropTypes.object,
    labelStyle: PropTypes.object,
    inputStyle: PropTypes.object,
   },

   getDefaultProps () {
     return {
       multi: false,
       disable: false,
       allowCreate: false,
       clearable: true,
       searchable: true,
       isLoading: false,
       display: 'name',
       set: 'id',
       optionRenderer: null
     }
   },

   getInitialState(){
      return {
          className: 'select-style'
        };
      },

   renderRequired(){
     if (this.props.required){
       return (
         <span style={this.props.requiredStyle || requiredStyle}>*</span>
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

   handleOnChange(values){
     var valueObj;
     if(values && this.props.required){
       this.setState({className: 'success-in-select'});
     } else { this.setState({className: 'focus-in-select'});}

     if (values) {
       valueObj = (this.props.multi) ? values.split('♣') : values;

       this.context.form.setInputValue(this.props.name, valueObj);
     } else {
       this.context.form.setInputValue(this.props.name, (this.props.multi) ? [] : '')
       if(this.props.required) this.setState({className: 'error-in-select'});
     };
     if(this.props.onSelect) this.props.onSelect(valueObj || values);
   },

   changeStyleOnBlur() {
     if (this.context.form.getInputValue(this.props.name) || !this.props.required)
        this.setState({className: 'select-style'});
     else if (this.props.required) {
         this.setState({className: 'error-on-blur'});
         this.setState({error: this.props.required});
     }

   },


   render() {
    const { props } = this
    var value= this.context.form.getInputValue(this.props.name);
    var inputStyle = this.props.inputStyle;
    if(!inputStyle.position) inputStyle.position = 'relative'


     return (
      <div style={ this.props.inputStyle }>
        <span className="SmartSelect-label" style={merge(labelStyle, props.labelStyle)}>{this.props.label}</span>
        <div className={cx('SmartSelect-selectwrap', this.state.className)} style={this.props.style} >
          <Select
            name= {this.props.name}
            multi= {this.props.multi}
            options= {this.props.options}
            disabled= {this.props.disable}
            allowCreate= {this.props.allowCreate}
            filterOptions={this.props.filterOptions}
            filterOption={this.props.filterOption}
            clearable= {this.props.clearable}
            clearAllText= 'Remove all choices'
            clearValueText= 'Remove choice'
            noResultsText= 'No results found'
            placeholder= {this.props.placeholder}
            searchable= {this.props.searchable}
            isLoading= {this.props.isLoading}
            searchingText= 'Searching...'
            value= {this.context.form.getInputValue(this.props.name)}
            labelKey= {this.props.display}
            valueKey= {this.props.set}
            onChange= {this.handleOnChange}
            onInputChange={this.props.onInputChange}
            onBlur= {this.changeStyleOnBlur}
            optionRenderer={this.props.optionRenderer}
            delimiter={(this.props.multi) ? '♣' : ''}
          />
          {this.renderError()}
        </div>
        {this.renderRequired()}
      </div>
     );
   }
 })
