var React = require('react');
var PropTypes = React.PropTypes;
import {Button} from 'react-bootstrap';

var btnStyle = {
  position: 'relative',
  borderRadius: '4px',
  padding: '6px 12px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  width: '25%',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
}
require('./small-loader.css');
var core = require('core');
core.Component('Button.Loader', [
  'webint.mixin', 'Loader', 'ui'
], (mixin, Loader, ui) => {
  return {
    mixins: [mixin],

    propTypes: {
      background: React.PropTypes.string,
      show: React.PropTypes.bool,
      text: React.PropTypes.string,
      click: React.PropTypes.func
    },
    getDefaultProps() {
      return {background: '#31B0D5', size:'sm'};
    },
    contextTypes: {
      form: PropTypes.object
    },
    ifSilent() {
      var valid = this.context.form.state.isValid;

      if (!valid)
        return true;
      return false;
    },
    renderLoader() {
      if (!this.props.show) {
        return (null);
      }
      return (
          <div className="sm-sk-fading-circle">
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
      );
    },
    onSubmit() {
      if (this.ifSilent()) return ;
      else {
        this.context.form.submit();
      }
    },
    render() {
      var props = {
        ...this.props.style
      };
      var button = {
        ...btnStyle,
        background: this.props.background,
        cursor: (this.ifSilent())
          ? 'not-allowed'
          : 'pointer',
        opacity: (this.ifSilent())
          ? '.65'
          : '1',
        minWidth: props.width || '35%',
        justifyContent: (this.props.show && this.props.text.length > 0)
          ? 'space-between'
          : 'center',
        width: (this.props.show)
          ? props.width || '40%'
          : props.width || '25%',

          ...props,
      }
      return (
        <div onClick={this.onSubmit} style={ button }>
          <span>{ this.props.text }</span>
          {this.renderLoader()}
        </div>
      );
    }
  }
});
