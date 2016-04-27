var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
core.Component('Button.Add', ['webint.mixin'], (mixin) => { // TODO: change the icon according to design

  return {
    mixins:[mixin],
    propTypes: {
      onAdd: PropTypes.func
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
        cursor: 'pointer',
        margin: '0 10px',
        color: (this.state.hover)
          ? this.theme('hovers.primary')
          : this.theme('inactive.primary')
      };

      return (
        <div onClick={this.props.onAdd} style={ button } onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut }>
          <i className="fa fa-plus" ></i>
        </div>
      )
    }
  }
});
