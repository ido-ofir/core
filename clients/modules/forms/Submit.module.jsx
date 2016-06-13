var React = require('react');
var PropTypes = React.PropTypes;

core.Component('forms.Submit', [
  'ui.Loader',
  'ui.Button'
], (Loader, Button)=>{
  return {

    contextTypes: {
      form: PropTypes.object
    },

    onSubmit(){
      this.context.form.submit();
    },

    renderContent(){
      if(this.context.form.state.isHalted){
        return <Loader show={ true } spinner={ 3 } background="none"/>
      }
      return null;
    },

    render() {
      return (
        <Button style={this.props.style} bsStyle="info" onClick={this.onSubmit}>
            { this.renderContent() }
            { this.props.children }
        </Button>
      );
    }
  };
})
