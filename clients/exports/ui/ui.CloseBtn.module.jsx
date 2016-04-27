var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

var closeStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 20,
  cursor: 'pointer'
};
core.Component('ui.CloseBtn', {
  propTypes: {
    onClick: PropTypes.func,
    className : PropTypes.string,
    style : PropTypes.object
  },

  defaultClick(){
    console.log('closeBtn clicked');
  },

  getDefaultProps(){
    return {
      onClick: this.defaultClick
    };
  },

  render () {
    var inlineStyle = { ...closeStyle, ...this.props.style };
    var className = `icon-close-circle`;
    if(this.props.className) className += ` ${this.props.className}`;
    return (
      <span className={ className } style={ inlineStyle } onClick={ this.props.onClick }></span>
    );
  }

});
