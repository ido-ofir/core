var React = require('react');
var PropTypes = React.PropTypes;
import { Button } from 'react-bootstrap';

var core = require('core');

core.Component('ResponsiveButton', ['Loader'], (Loader)=>{
  return {

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

    renderContent(){
      if(this.context.form.state.isHalted){
        return (
          <div style={{position: 'relative', textAlign: 'center'}}>
            <div className="sm-sk-fading-circle" style={{display: 'inline-block'}}>
              <div className="sk-circle1 sk-circle"></div>
              <div className="sk-circle2 sk-circle"></div>
              <div className="sk-circle3 sk-circle"></div>
              <div className="sk-circle4 sk-circle"></div>
              <div className="sk-circle5 sk-circle"></div>
              <div className="sk-circle6 sk-circle"></div>
              <div className="sk-circle7 sk-circle"></div>
              <div className="sk-circle8 sk-circle"></div>
              <div className="sk-circle9 sk-circle"></div>
              <div className="sk-circle10 sk-circle"></div>
              <div className="sk-circle11 sk-circle"></div>
              <div className="sk-circle12 sk-circle"></div>
            </div>
          </div>
        );
      }
      return this.props.children;
    },

    render() {
      var style = { ...this.props.style };
      if(!style.position) style.position = 'relative';
      // console.debug("this.context.form.isHalted", this.context.form.isHalted);
      return (
        <Button style={ style } bsStyle="info" onClick={this.handleOnClick} disabled={typeof this.props.isDisabled === "undefined" ? this.ifSilent() : this.props.isDisabled}>
              { this.renderContent() }
        </Button>
      );
    }
  };
})
