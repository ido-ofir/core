var React = require('react');
var PropTypes = React.PropTypes;
import { Input } from 'react-bootstrap';
var inputMixin = require('./mixins/input.jsx');

var checkBoxStyle = {
  margin: 8,

}

 module.exports = React.createClass({
   mixins: [inputMixin],

   propTypes: {
     name: PropTypes.string.isRequired,
     label: PropTypes.string.isRequired,
     disabled: PropTypes.bool,
   },

   handleOnChange(e){
     var value = e.target.checked;
     this.context.form.setInputValue(this.props.name, value);
   },

   render() {
    var value= this.context.form.getInputValue(this.props.name);

     return (
      <div style={checkBoxStyle}>
        <input type="checkBox" name={this.props.name} checked={value}
          disabled={this.props.disabled} onChange={this.handleOnChange}/>
          {"  "+this.props.label}
      </div>
     );
   }
 });
