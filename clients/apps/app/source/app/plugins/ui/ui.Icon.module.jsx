var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
var Radium = require('radium');

var iconStyle = {
  width: 30,
  height: 30,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

core.Component('ui.Icon', {
  enhancers: [Radium],
  propTypes: {
    onColor: PropTypes.string,
    offColor: PropTypes.string,
    activeColor: PropTypes.string,
    size: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
    active: PropTypes.bool
  },
  getDefaultProps(){
    return {
      active: false
    };
  },
  render: function() {

    var onColor = this.props.onColor || core.theme('colors.primary');
    var offColor = this.props.offColor || core.theme('inactive.primary');
    var activeColor = this.props.activeColor || core.theme('colors.secondary');
    var style = [
        iconStyle,
        this.props.style,
        {
          color: this.props.active ? activeColor: offColor,
          ':hover': {
            color: this.props.active ? activeColor: onColor
          },
          ':active': {
            color: activeColor
          }
        }
      ];
      if(this.props.size) style.push({ fontSize: this.props.size });
    return (
      <div { ...this.props } style={ style } title={ this.props.title || '' }>
      { this.props.children }
      </div>
    );
  }
});
