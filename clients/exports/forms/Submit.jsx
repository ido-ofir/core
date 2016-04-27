var React = require('react');
var PropTypes = React.PropTypes;
import { Button } from 'react-bootstrap';

 module.exports = React.createClass({

   contextTypes: {
     form: PropTypes.object
   },

   onSubmit(){
     this.context.form.submit();
   },

   ifSilent(){
  //   var silent = this.context.form.state.isSilent;
     var valid = this.context.form.state.isValid;

     if (!valid) return true;
     return false;
   },

   render() {
     return (
       <Button style={this.props.style} bsStyle="info" onClick={this.onSubmit} disabled={this.ifSilent()}>
             { this.props.children }
       </Button>
     );
   }
 });
