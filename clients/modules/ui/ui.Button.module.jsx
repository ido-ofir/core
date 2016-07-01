
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
var Radium = require('radium');

var closeStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 20,
  cursor: 'pointer'
};
core.Component('ui.Button', {
  enhancers: [Radium],
  propTypes: {
    onClick: PropTypes.func,
    type : PropTypes.oneOf(['primary', 'secondary', 'success', 'error']),
    size: PropTypes.oneOf(['small', 'large']),
    hollow : PropTypes.bool,
    disabled : PropTypes.bool,
    className : PropTypes.string,
    style : PropTypes.object,
    background : PropTypes.string,
    color : PropTypes.string,
    inactiveColor : PropTypes.string,
    hoverColor : PropTypes.string
  },

  defaultClick(){
    console.log('closeBtn clicked');
  },

  getDefaultProps(){
    return {
      onClick: this.defaultClick,
      type: 'primary',
      size: 'large',
      hollow: false,
      disabled: false,
      background: '#fff'
    };
  },

  render () {

    var hollow = this.props.hollow;
    var disabled = this.props.disabled;
    var size = this.props.size;
    var color = this.props.color || core.theme(`colors.${this.props.type}`);
    var inactiveColor = this.props.inactiveColor || core.theme(`inactive.${this.props.type}`);
    var hoverColor = this.props.hoverColor || core.theme(`hovers.${this.props.type}`);

    var textColor = hollow ? (disabled ? inactiveColor : color) : '#fff';
    var background = hollow ? this.props.background : (disabled ? inactiveColor : color);
    var cursor = disabled ? 'not-allowed' : 'pointer';

    var button = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: cursor,
      textTransform:'uppercase',
      minWidth: (size === 'small' ? '106px' : '140px'),
      height: (size === 'small' ? '31px' : '40px'),
      fontSize: (size === 'small' ? '12px' : '14px'),
      borderRadius: '4px',
      color: textColor,
      background: background,
      WebkitTransition: '0.2s ease',
      transition: '0.2s ease',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: disabled ? inactiveColor : (hollow ? color : background),
      ':hover': {
        color: (hollow ? (disabled ? inactiveColor : hoverColor) : '#fff'),
        background: (disabled ? background : (hollow ? '#fff' : hoverColor)),
        borderColor: disabled ? inactiveColor : hoverColor
      },
      ...this.props.style
    };

    return (
      <div style={ button } onClick={ this.props.onClick }>
        { this.props.children }
      </div>
    );
  }

});
