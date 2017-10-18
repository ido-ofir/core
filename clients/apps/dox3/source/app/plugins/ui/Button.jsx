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

/**
 * @component ui.Button
 * @description some decription
 * @example
 * * item 1
 * * item 2
 * ```jsx
 * <ui.Button>Hello</ui.Button>
 * ```
 * @prop onClick {function}
 * @prop type {function}
 * @prop size {function}
 */

module.exports = {
    name: 'Button',
    get(){
        return {
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
                activeColor : PropTypes.string,
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

                var { hollow, disabled, type, size, color, inactiveColor, hoverColor, background, activeColor, onClick, ...props } = this.props;
                color = color || core.theme(`colors.${type}`);
                inactiveColor = inactiveColor || core.theme(`inactive.${type}`);
                hoverColor = hoverColor || core.theme(`hovers.${type}`);
                activeColor = activeColor || core.theme(`active.${type}`);

                var opacity = disabled ? '.65' : '1';
                var textColor = hollow ? (disabled ? inactiveColor : color) : '#fff';
                var background = hollow ? background : color;
                var cursor = disabled ? 'not-allowed' : 'pointer';

                var focusStyle = {
                    borderColor: '#66afe9',
                    WebkitBoxShadow: 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)',
                    // WebkitBoxShadow: 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,230,0,.6)',
                    boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)'
                };

                var activeStyle = {
                    background: activeColor
                };

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
                outline: 0,
                background: background,
                opacity: opacity,
                WebkitTransition: '0.2s ease',
                transition: '0.2s ease',
                borderWidth: '1px',
                borderStyle: 'solid',
                // borderColor: disabled ? inactiveColor : (hollow ? color : background),
                ':hover': {
                    color: (hollow ? (disabled ? inactiveColor : hoverColor) : '#fff'),
                    background: (disabled ? background : (hollow ? '#fff' : hoverColor)),
                    // borderColor: disabled ? inactiveColor : hoverColor
                },
                ':focus': focusStyle,
                ':active': activeStyle,
                ...props.style
                };

                return (
                <button style={ button } onClick={ disabled ? null : onClick } { ...props }>
                    { this.props.children || 'Button' }
                </button>
                );
            }
        }
    } 
};
