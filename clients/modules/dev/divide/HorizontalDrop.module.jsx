
var React = require('react');
var ReactDom = require('react-dom');
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

core.Component('divide.HorizontalDrop', [
  'divide.HorizontalLine',
  'dnd.DropPad'
], (HorizontalLine, DropPad)=>{
  return {
    getInitialState(){
      return {
        active: false,
        height: this.props.height || '50%',
        top: 0
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
      var props = this.props.elementCursor.get('props');
      this.props.elementCursor.set('props', { ...props, height: this.state.height });
    },
    onMouseMove(e){
      if(this.state.active){
        var height = ((e.clientY - this.state.top) / this.el.clientHeight * 100) + '%';
        this.setState({
          height: height
        });
      }

    },
    renderTop(height){
      var topStyle = {
          ...style,
          top: 0,
          height: height
      };
      // var child = this.props.children ? (this.props.children[0] || null) : null;
      return (
        <div style={ topStyle }>
          <DropPad cursor={ this.props.elementCursor.select('children', 0)}/>
        </div>
      );
    },
    renderBottom(height){
      var bottomStyle = {
          ...style,
          bottom: 0,
          top: height
      };
      // var child = this.props.children ? (this.props.children[1] || null) : null;
      return (
        <div style={ bottomStyle }>
          <DropPad cursor={ this.props.elementCursor.select('children', 1)}/>
        </div>
      );
    },
    render(){
      var height = this.state.height;
      return (
        <div style={ boxStyle } onMouseMove={ this.onMouseMove } ref="box">
          { this.renderTop(height) }
          <HorizontalLine top={ height } onMouseDown={ this.activate }/>
          { this.renderBottom(height) }
        </div>
      );
    }
  };
});
