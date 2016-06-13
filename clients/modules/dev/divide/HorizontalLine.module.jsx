
var React = require('react');
var core = require('core');

var style = {
  position: 'absolute',
  left: 0,
  right: 0
};

var handleStyle = {
  ...style,
  top: '-10px',
  bottom: '-10px',
  cursor: 'ns-resize'
};
var markerStyle = {
  ...style,
  top: '10px',
  height: '1px',
  background: '#ddd'
};

core.Component('divide.HorizontalLine', {
  render(){
    var centerStyle = {
      ...style,
      zIndex: 2
    };
    if(this.props.bottom) centerStyle.bottom = this.props.bottom;
    else centerStyle.top = this.props.top;
    return (
      <div style={ centerStyle } onMouseDown={ this.props.onMouseDown }>
        <div style={ handleStyle }>
          <div style={ markerStyle }></div>
        </div>
      </div>
    );
  }
});
