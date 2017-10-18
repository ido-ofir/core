var React = require('react');
var PropTypes = React.PropTypes;
var Radium = require('radium');

var iconStyle = {
  width: 30,
  height: 30,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

module.exports = {
    name: 'Icon',
    get(){

        var core = this;
        
        return {
            enhancers: [Radium],
            propTypes: {
                onColor: PropTypes.string,
                offColor: PropTypes.string,
                activeColor: PropTypes.string,
                oneColor: PropTypes.string,
                size: PropTypes.any,
                onClick: PropTypes.func,
                title: PropTypes.string,
                active: PropTypes.bool
            },

            getDefaultProps(){
                return {
                active: false
                };
            },

            handleOnClick(e){
                if (this.props.onClick) {
                e.stopPropagation();
                this.props.onClick(e);
                };
            },

            render: function() {
                var { onColor, offColor, activeColor, oneColor, active, size, title, onClick, ...props } = this.props;
                onColor = onColor || core.theme('colors.primary');
                offColor = offColor || core.theme('inactive.primary');
                activeColor = activeColor || core.theme('colors.secondary');
                if (oneColor) { onColor = offColor = activeColor = oneColor};
                var style = [
                    iconStyle,
                    props.style,
                    {
                    color: active ? activeColor: offColor,
                    ':hover': {
                        color: active ? activeColor: onColor
                    },
                    ':active': {
                        color: activeColor
                    }
                    }
                ];
                if(size) style.push({ fontSize: parseInt(size) });
                return (
                <div { ...props } style={ style } title={ title || '' } onClick={this.handleOnClick}>
                { this.props.children }
                </div>
                );
            }
        }
    }
}
