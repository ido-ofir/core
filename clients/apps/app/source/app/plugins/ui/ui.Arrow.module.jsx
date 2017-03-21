var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

var arrowStyle = {
  position: 'absolute',
  width: 0,
  borderColor: 'transparent',
  borderRightColor: '#ddd',
  borderWidth: '11px 11px 11px 0',
  height: '22px',
  borderStyle: 'solid',
  left: '-11px'
};

var innerStyle = {
  position: 'absolute',
  borderLeftWidth: 0,
  position: 'absolute',
  width: 0,
  borderColor: 'transparent',
  borderRightColor: '#fff',
  borderWidth: '10px 10px 10px 0',
  height: '20px',
  borderStyle: 'solid',
  top: '-10px',
  left: '1px'
}

core.Component('ui.Arrow', {
  render: function() {
    return (
      <div { ...this.props } style={{ ...arrowStyle, ...this.props.style }}>
        <span style={ innerStyle }></span>
      </div>
    );
  }
});
