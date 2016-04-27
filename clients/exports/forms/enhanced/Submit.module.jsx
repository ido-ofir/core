var React = require('react');
var PropTypes = React.PropTypes;
import { Button } from 'react-bootstrap';

core.Component('Submit', ['Loader'], (Loader)=>{
  return {

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

    renderContent(){
      if(this.context.form.state.isHalted){
        return <Loader show={ true } spinner={ 3 } background="none"/>
      }
      return null;
    },

    render() {
      return (
        <Button style={this.props.style} bsStyle="info" onClick={this.onSubmit} disabled={this.ifSilent()}>
            { this.renderContent() }
            { this.props.children }
        </Button>
      );
    }
  };
})
