var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

var style = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: "100%",
  height: "60px",
  padding: "15px",
  position: "relative"
};

core.Component('ui.Header', {
  render: function() {
    return (
      <div style={{
        ...style,
        ...this.props.style
      }}>
      { this.props.children }
      </div>
    );
  }
});
