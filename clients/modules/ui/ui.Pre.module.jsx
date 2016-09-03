var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

var style = {
    display: 'block',
    padding: '9.5px',
    margin: '0 0 10px',
    fontSize: '13px',
    lineHeight: '1.42857143',
    color: '#333',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontFamily: 'Menlo,Monaco,Consolas,"Courier New",monospace',
};

core.Component('ui.Pre', {
  render: function() {
    return (
      <pre { ...this.props } style={{ ...style, ...this.props.style }}>
      { this.props.children }
    </pre>
    );
  }
});
