
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
    disabledColor : PropTypes.string,
    hoverColor : PropTypes.string
  },

  defaultClick(){
    console.log('closeBtn clicked');
  },

  getInitialState(){
    return this.watch({ pallete: ['core', 'theme', 'palletes', { name: this.props.type || 'primary' }, 'pallete'] })
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
    var pallete = this.state.pallete;

      var hollow = this.props.hollow;
      var disabled = this.props.disabled;
      var size = this.props.size;
      var isSmall = size === 'small';
      var color = this.props.color || pallete.normal;
      var disabledColor = this.props.disabledColor || pallete.disabled;
      var hoverColor = this.props.hoverColor || pallete.hover;
      var activeColor = this.props.activeColor || pallete.active;

      var textColor = hollow ? (disabled ? disabledColor : color) : '#fff';
      var background = hollow ? this.props.background : (disabled ? disabledColor : color);
      var cursor = disabled ? 'not-allowed' : 'pointer';

      var button = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: cursor,
        textTransform:'uppercase',
        minWidth: (isSmall ? '106px' : '140px'),
        height: (isSmall ? '31px' : '40px'),
        fontSize: (isSmall ? '12px' : '14px'),
        borderRadius: '4px',
        color: textColor,
        background: background,
        WebkitTransition: '0.2s ease',
        transition: '0.2s ease',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: disabled ? disabledColor : (hollow ? color : background),
        ':hover': {
          color: (hollow ? (disabled ? disabledColor : hoverColor) : '#fff'),
          background: (disabled ? background : (hollow ? '#fff' : hoverColor)),
          borderColor: disabled ? disabledColor : hoverColor
        },
        ':active': {
          background: (disabled ? background : (hollow ? '#fff' : activeColor)),
          borderColor: disabled ? disabledColor : activeColor
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
