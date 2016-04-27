
var React = require('react');
var ReactDom = require('react-dom');
var PropTypes = React.PropTypes;
var core = require('core');

var style = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  overflow: 'auto',
};
var boxStyle = {
  ...style,
  left: 0,
  right: 0
}

core.Component('divide.Vertical', [
  'divide.VerticalLine'
], (VerticalLine)=>{
  return {
    propTypes: {
      ns: PropTypes.string,
      width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      from: PropTypes.oneOf(['left', 'right']),
      disabled: PropTypes.bool
    },
    getInitialState(){
      var width;
      if(this.props.ns) width = localStorage.getItem(`${this.props.ns}.width`);
      return {
        active: false,
        width: width || this.props.width || '50%',
        left: 0
      };
    },
    componentDidMount(){
      this.el = this.refs.box;
      // window.addEventListener('mouseup', this.deactivate, false);
    },
    componentWillReceiveProps(props){
      if(props.ns !== this.props.ns){
        this.setState({
          width: localStorage.getItem(`${props.ns}.width`)
        });
      }
    },
    activate(){
      if(this.props.disabled) return;
      var el = this.el;
      var left = 0;
      while(el){
        if(!isNaN(el.offsetLeft)){
          left = left + el.offsetLeft;
        }
        el = el.parentNode;
      }
      this.setState({active: true, left: left});
    },
    deactivate(){
      this.setState({active: false});
      // var props = this.props.elementCursor.get('props');
      // this.props.elementCursor.set('props', { ...props, width: this.state.width });
    },
    onMouseMove(e){
      if(this.state.active){
        var from = this.props.from;
        var width, px;
        if(from === 'right'){
          width = (this.el.clientWidth - (e.clientX)) + 'px';  // removed this.state.left :/
        }
        else if(from === 'left'){
          width = (e.clientX - this.state.left) + 'px';
        }
        else{
          width = ((e.clientX - this.state.left) / this.el.clientWidth * 100) + '%';
        }
        if(this.props.ns) localStorage.setItem(`${this.props.ns}.width`, width);
        this.setState({
          width: width
        });
      }

    },
    renderLeft(width){
      var from = this.props.from;
      var leftStyle = {
          ...style,
          left: 0
      };
      if(!from || from === 'left'){
        leftStyle.width = width;
      }
      else{
        leftStyle.right = width;
      }
      // var child = this.props.children ? (this.props.children[0] || null) : null;
      return (
        <div style={ leftStyle }>
          { this.props.children[0] }
        </div>
      );
    },
    renderRight(width){
      var from = this.props.from;
      var rightStyle = {
          ...style,
          right: 0
      };
      if(from === 'right'){
        rightStyle.width = width;
      }
      else{
        rightStyle.left = width;
      }
      // var child = this.props.children ? (this.props.children[1] || null) : null;
      return (

        <div style={ rightStyle }>
          { this.props.children[1] }
        </div>
      );
    },
    renderLine(left, right){
      if(this.props.disabled) return null;
      return (
        <VerticalLine left={ left } right={ right } onMouseDown={ this.activate }/>
      );
    },
    render(){
      var left, right, width = this.state.width;
      if(this.props.from === 'right') right = width;
      else left = width;
      return (
        <div style={ boxStyle } onMouseMove={ this.onMouseMove } onMouseUp={ this.deactivate } ref="box">
          { this.renderLeft(width) }
          { this.renderLine(left, right) }
          { this.renderRight(width) }
        </div>
      );
    }
  };
});
