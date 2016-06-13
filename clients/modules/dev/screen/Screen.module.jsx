var React = require('react');
var PropTypes = React.PropTypes;

var core = require('core');

core.Component('Screen', {
  propTypes: {
    src: PropTypes.string,
    style: PropTypes.object
  },
  getInitialState(){
    return {
      isOpen: false,
      keyCode: 68,  // 'D' with ctrl key
      style: this.props.style || {}
    };
  },
  componentDidMount(){
    window.addEventListener('keydown', this.keyDown, false);
  },
  keyDown(e){
    if(e.keyCode === this.state.keyCode){
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  },
  componentWillUnmount(){
    window.removeEventListener('keydown', this.keyDown, false);
  },
  render(){
    if(!this.state.isOpen) return null;
    var style = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      ...this.props.style
    };
    return (
      <img src={ this.props.src } style={ style }/>
    );
  }
});
