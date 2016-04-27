
var React = require('react');
var ReactDom = require('react-dom');
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

core.Component('divide.VerticalDrop', [
  'divide.VerticalLine',
  'dnd.DropPad'
], (VerticalLine, DropPad)=>{
  return {
    getInitialState(){
      return {
        active: false,
        width: this.props.width || '50%',
        left: 0
      };
    },
    componentDidMount(){
      this.el = ReactDom.findDOMNode(this);
      window.addEventListener('mouseup', this.deactivate, false);
    },
    componentWillUnmount(){
      window.removeEventListener('mouseup', this.deactivate, false);
    },
    activate(){
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
      var props = this.props.elementCursor.get('props');
      this.props.elementCursor.set('props', { ...props, width: this.state.width });
    },
    onMouseMove(e){
      if(this.state.active){
        var width = ((e.clientX - this.state.left) / this.el.clientWidth * 100) + '%';
        this.setState({
          width: width
        });
      }

    },
    renderLeft(width){
      var leftStyle = {
          ...style,
          left: 0,
          width: width
      };
      // var child = this.props.children ? (this.props.children[0] || null) : null;
      return (
        <div style={ leftStyle }>
          <DropPad cursor={ this.props.elementCursor.select('children', 0)}/>
        </div>
      );
    },
    renderRight(width){
      var rightStyle = {
          ...style,
          right: 0,
          left: width
      };
      // var child = this.props.children ? (this.props.children[1] || null) : null;
      return (

        <div style={ rightStyle }>
          <DropPad cursor={ this.props.elementCursor.select('children', 1)}/>
        </div>
      );
    },
    render(){
      var width = this.state.width;
      return (
        <div style={ boxStyle } onMouseMove={ this.onMouseMove } ref="box">
          { this.renderLeft(width) }
          <VerticalLine left={ width } onMouseDown={ this.activate }/>
          { this.renderRight(width) }
        </div>
      );
    }
  };
});
