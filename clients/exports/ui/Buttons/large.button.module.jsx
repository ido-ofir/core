var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

core.Component('Button.Large', ['webint.mixin','layout'], (mixin, layout) => {

  return {
    mixins:[mixin],
    propTypes: {
      onClick: PropTypes.func,
      textColor: PropTypes.string,
      onColor: PropTypes.string,
      offColor: PropTypes.string
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

        ...layout.flexAlignHor,
        ...layout.flexAlignVert,

        cursor:'pointer',
        textTransform:'uppercase',
        width: '140px',
        height: '40px',
        borderRadius: '4px',
        border: (!this.props.border) ?
          `0` : `1px solid ${this.props.border}`,
        color: this.props.textColor,
        background: (this.state.hover)
            ? this.props.offColor
            : this.props.onColor
      };

      return (
        <div onClick={this.props.onClick} style={ button } onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut }>
          { this.props.children }
        </div>
      )
    }
  }
});
