var React = require('react');
var core = require('core');

core.Component('ui.Json', {
  shouldComponentUpdate(nextProps){
    return nextProps.children !== this.props.children;
  },
  render: function() {
    return (
      <pre { ...this.props }>
      { JSON.stringify(this.props.children) }
      </pre>
    );
  }
});
