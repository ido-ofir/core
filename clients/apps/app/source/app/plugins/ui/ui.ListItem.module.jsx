var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
var Radium = require('radium');

var listItemStyle = {
  lineHeight: '30px',
  padding: '0 10px',
  background: '#fff',
  transition: '0.2s ease background',
  cursor: 'pointer',
  WebkitTransition: '0.2s ease background',
  ":hover": {
    background: '#ddd'
  }
};

core.Component('ui.ListItem', {
  enhancers: [Radium],
  propTypes: {
    selected: 'bool'
  },
  render: function() {
    return (
      <div { ...this.props } style={{ ...listItemStyle, ...this.props.style, background: (this.props.selected ? '#eee' : '#fff') }}>
      { this.props.children }
      </div>
    );
  }
});
