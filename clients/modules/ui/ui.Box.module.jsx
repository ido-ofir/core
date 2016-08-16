var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

var boxStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overfolw: 'auto'
};

core.Component('ui.Box', {
  render: function() {
    return (
      <div { ...this.props } style={{ ...boxStyle, ...this.props.style }}>
      { this.props.children }
      </div>
    );
  }
});
