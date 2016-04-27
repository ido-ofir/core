
var React = require('react');
var PropTypes = React.PropTypes;

var core = require('core');
var Element = core.Element;

var style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
}

core.Component('dnd.DropPad', {
  propTypes:{
    cursor: React.PropTypes.object
  },
  drop(data){
    this.props.cursor.set(data);
  },
  render(){
    var element = this.props.cursor.get();
    if(!element){
      return (
          <Drop drop={ this.drop } style={ style }></Drop>
      );
    }
    return <Element cursor={ this.props.cursor }/>
  }
});
