
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

var style = {
  position: 'absolute',
  left: 0,
  right: 0,
  overflow: 'auto',
};
var boxStyle = {
  ...style,
  top: 0,
  bottom: 0
};

core.Component('divide.Horizontal', [
  'divide.HorizontalLine'
], (HorizontalLine)=>{
  return {
    propTypes: {
      ns: PropTypes.string,
      height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      from: PropTypes.oneOf(['top', 'bottom']),
      disabled: PropTypes.bool
    },
    getInitialState(){
      var height;
      if(this.props.ns) height = localStorage.getItem(`${this.props.ns}.height`);
      return {
        active: false,
        height: height || this.props.height || '50%',
        top: 0
      };
    },
    componentDidMount(){
      this.el = this.refs.box;
      // window.addEventListener('mouseup', this.deactivate, false);
    },
    activate(){
      if(this.props.disabled) return;
      var el = this.el;
      var top = 0;
      while(el){
        if(!isNaN(el.offsetTop)){
          top = top + el.offsetTop;
        }
        el = el.parentNode;
      }
      this.setState({active: true, top: top});
    },
    deactivate(){
      this.setState({active: false});
      // var props = this.props.elementCursor.get('props');
      // this.props.elementCursor.set('props', { ...props, height: this.state.height });
    },
    onMouseMove(e){
      if(this.state.active){
        var from = this.props.from;
        var height;
        if(from === 'bottom'){
          height = (this.el.clientHeight - (e.clientY)) + 'px';
        }
        else if(from === 'top'){
          height = (e.clientY) + 'px';
        }
        else{
          height = ((e.clientY) / this.el.clientHeight * 100) + '%';
        }
        if(this.props.ns) localStorage.setItem(`${this.props.ns}.height`, height);
        this.setState({
          height: height
        });
      }

    },
    renderTop(height){
      var from = this.props.from;
      var topStyle = {
          ...style,
          top: 0
      };
      if(!from || from === 'top'){
        topStyle.height = height;
      }
      else{
        topStyle.bottom = height;
      }
      // var child = this.props.children ? (this.props.children[0] || null) : null;
      return (
        <div style={ topStyle }>
          { this.props.children[0] }
        </div>
      );
    },
    renderBottom(height){
      var from = this.props.from;
      var bottomStyle = {
          ...style,
          bottom: 0
      };
      // var child = this.props.children ? (this.props.children[1] || null) : null;
      if(from === 'bottom'){
        bottomStyle.height = height;
      }
      else{
        bottomStyle.top = height;
      }
      return (
        <div style={ bottomStyle }>
          { this.props.children[1] }
        </div>
      );
    },
    renderLine(height, bottom){
      if(this.props.disabled) return null;
      return (
        <HorizontalLine top={ height } bottom={ bottom } onMouseDown={ this.activate }/>
      );
    },
    render(){
      var height = this.state.height;
      var top, bottom, height = this.state.height;
      if(this.props.from === 'bottom') bottom = height;
      else top = height;
      return (
        <div style={ boxStyle } onMouseMove={ this.onMouseMove } onMouseUp={ this.deactivate } ref="box">
          { this.renderTop(height) }
          { this.renderLine(height, bottom) }
          { this.renderBottom(height) }
        </div>
      );
    }
  };
});
