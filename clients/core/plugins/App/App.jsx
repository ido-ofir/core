var React = require('react');
var PropTypes = React.PropTypes;
var Baobab = require('baobab');
// comment
var style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden'
};



var App = function (core) {
  return {
    componentDidMount(){
      document.body.addEventListener('keyup', this.onKeyUp);  // react does not fire the keyUp event if an input is not focused, so we use native.
    },
    binding: {
      source: ['core', 'source']
    },
    onClick(e){ core.emit('bodyClick', e); },
    // onMouseUp(e){ core.emit('mouseUp', e); },
    // onMouseMove(e){ core.emit('mouseMove', e); },
    onKeyUp(e){
      core.emit('keyUp', e);
      if(e.keyCode === 27){
        core.emit('escKey', e);
      }
      else if(e.keyCode === 13){
        core.emit('enterKey', e);
      }
      else if(e.keyCode === 37){
        core.emit('leftKey', e);
      }
      else if(e.keyCode === 39){
        core.emit('rightKey', e);
      }
      else if(e.keyCode === 38){
        core.emit('upKey', e);
      }
      else if(e.keyCode === 40){
        core.emit('downKey', e);
      }
    },
    render() {

      return (
        <div style={{ ...style, ...this.props.style }}
             onClick={ this.onClick }
             onMouseUp={ this.onMouseUp }>
          { this.props.children }
        </div>
      );
    }
  }
};

module.exports = App;
