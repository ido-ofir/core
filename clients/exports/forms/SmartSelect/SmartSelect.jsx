var React = require('react');
var PropTypes = React.PropTypes;
var Select = require('react-select');
var myCss = require('./select-style.css');

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
  left: '-12px',
  top: '-2px',
  color: 'red',
};

var labelStyle = {
  fontWeight: 400,
  fontSize: 14,
  marginBottom:'5px',
  color: '#374650',
};

var SmartSelect = React.createClass({
   mixins: [inputMixin],

   propTypes: {
     storeOption: PropTypes.bool,
     name: PropTypes.string.isRequired,
     options: PropTypes.array,
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
     inputStyle: PropTypes.object,
     onSelect: PropTypes.func,
     valueRenderer : PropTypes.func,
     showAsterisk: PropTypes.bool,
     showError: PropTypes.bool
   },

   getDefaultProps () {
     return {
       options: [],
       multi: false,
       disable: false,
       allowCreate: false,
       clearable: true,
       searchable: true,
       isLoading: false,
       display: 'name',
       set: 'id',
       optionRenderer: null,
       showAsterisk: true,
       showError: false
     }
   },

   getInitialState(){
      return {
          className: 'select-style',
          selectedOption: null
        };
      },

   renderRequired(){
     if (this.props.required && this.props.showAsterisk){
       return (
         <span style={requiredStyle}>*</span>
       );
     }
   },

   renderError(){
     if(!this.state.error || !this.props.showError) return null;
     return (
       <div style={ errorStyle }>
           { this.state.error }
       </div>
     );
   },

   handleOnChange(values, selectedOptions){
     var valueObj;
     if(values && this.props.required){
       this.setState({className: 'success-in-select'});
     } else { this.setState({className: 'focus-in-select'});}


     if (values) {
       valueObj = (this.props.multi) ? values.split('♣') : values;
       this.context.form.setInputValue(this.props.name, valueObj);
     } else {
      //  this.context.form.setInputValue(this.props.name, (this.props.multi) ? [] : '')   // this causes the form to stay valid when there are no values
       this.context.form.setInputValue(this.props.name, '')
       if(this.props.required) this.setState({className: 'error-in-select'});
     };
     if(this.props.onSelect) this.props.onSelect((valueObj || values), selectedOptions);
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
    var { valueRenderer } = this.props;
    var value = this.context.form.getInputValue(this.props.name);
    var displayValue = ((valueRenderer && valueRenderer(value)) || value) || "";

    return (
      <div className="SmartSelect-wrap-inputStyle" style={merge({ position:"relative" }, this.props.inputStyle)}>
        <span className="SmartSelect-label" style={merge(labelStyle, props.labelStyle)}>{this.props.label}</span>
        <div className={cx('SmartSelect-selectwrap-style', this.state.className)} style= {this.props.style} >
          <Select
            asyncOptions={this.props.asyncOptions}
            cacheAsyncResults={this.props.cacheAsyncResults}
            addLabelText={this.props.addLabelText}
            name= {this.props.name}
            multi= {this.props.multi}
            options= {this.props.options}
            disabled= {this.props.disable || this.props.disabled}
            allowCreate= {this.props.allowCreate}
            clearable= {this.props.clearable}
            clearAllText= 'Remove all choices'
            clearValueText= 'Remove choice'
            noResultsText= 'No results found'
            autoload={this.props.autoload}
            filterOptions={this.props.filterOptions}
            filterOption={this.props.filterOption}
            newOptionCreator={this.props.newOptionCreator}
            placeholder= {this.props.placeholder}
            loadOptions={this.props.loadOptions}
            searchable= {this.props.searchable}
            isLoading= {this.props.isLoading}
            searchingText= 'Searching...'
            value= {displayValue}
            labelKey= {this.props.display}
            onInputChange={this.props.onInputChange}
            valueKey= {this.props.set}
            onChange= {this.handleOnChange}
            onBlur= {this.changeStyleOnBlur}
            optionRenderer={this.props.optionRenderer}
            delimiter={(this.props.multi) ? '♣' : ''}
          />
          {this.renderError()}
          {this.renderRequired()}
        </div>
      </div>
     );
   }
 });

 module.exports = SmartSelect;
