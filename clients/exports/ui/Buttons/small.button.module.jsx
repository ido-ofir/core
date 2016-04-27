var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

core.Component('Button.Small', ['webint.mixin','layout'], (mixin, layout) => {

  return {
    mixins:[mixin],
    propTypes: {
      onClick: PropTypes.func,
      textColor: PropTypes.string,
      onColor: PropTypes.string,
      offColor: PropTypes.string
    },
    getDefaultProps(){
      return {
        textColor: '#fff',
        offColor:'#0099cc',
        onColor: '#005ca3'
      }
    },
    getInitialState() {
      return {hover: false}
    },
    onMouseOver() {
      this.setState({hover: true});
    },

    onMouseOut() {
      this.setState({hover: false});
    },

    render() {
      var button = {
        ...this.props.style,
        cursor:'pointer',
        textTransform:'uppercase',
        width: '105px',
        height: '30px',
        fontWeight: (this.state.hover) ? '800' : '700',
        fontSize:'12px',
        border: (!this.props.border) ?
          `0` : `1px solid ${this.props.border}`,

        borderRadius: '4px',
        ...layout.flexAlignHor,
        ...layout.flexAlignVert,
        color: this.props.textColor,
        background: (this.state.hover)
            ? this.props.offColor
            : this.props.onColor,
        transition: 'background 0.2s ease',
        WebkitTransform: 'background 0.2s ease',
      };

      return (
        <div onClick={this.props.onClick} style={ button } onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut }>
          { this.props.children }
        </div>
      )
    }
  }
});
