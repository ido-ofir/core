var React = require('react');
var PropTypes = React.PropTypes;
import { Button } from 'react-bootstrap';

 module.exports = React.createClass({

   contextTypes: {
     form: PropTypes.object
   },

   handleOnClick(){
     if (this.props.onClick)
      this.props.onClick();
   },

   ifSilent(){
     var valid = this.context.form.state.isValid;
     if (!valid) return true;
     return false;
   },

   render() {
     return (
       <Button style={this.props.style} bsStyle="info" onClick={this.handleOnClick} disabled={this.ifSilent()}>
             { this.props.children }
       </Button>
     );
   }
 });
