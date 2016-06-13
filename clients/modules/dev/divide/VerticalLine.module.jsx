
var React = require('react');
var core = require('core');

var style = {
  position: 'absolute',
  top: 0,
  bottom: 0
};

var handleStyle = {
  ...style,
  left: '-10px',
  right: '-10px',
  cursor: 'ew-resize'
};
var markerStyle = {
  ...style,
  left: '10px',
  width: '1px',
  background: '#ddd'
};

core.Component('divide.VerticalLine', {
  render(){
    var centerStyle = {
      ...style,
      zIndex: 2
    };
    if(this.props.right) centerStyle.right = this.props.right;
    else centerStyle.left = this.props.left;

    return (
      <div style={ centerStyle } onMouseDown={ this.props.onMouseDown }>
        <div style={ handleStyle }>
          <div style={ markerStyle }></div>
        </div>
      </div>
    );
  }
});
