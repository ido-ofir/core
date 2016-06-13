
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

function parse(data){
  try{
    return JSON.parse(data);;
  }
  catch(err){
    console.log('error parsing drop data:');
    console.error(err);
  }
}

function stopEvent(e){
  e.preventDefault();
  e.stopPropagation();
}


core.Component('dnd.Drop', {
  propTypes: {
    drop: PropTypes.func,
    drops: PropTypes.object,
    type: PropTypes.string
  },
  contextTypes: {
    drag: PropTypes.object
  },
  childContextTypes: {
    droppable: PropTypes.object
  },
  getChildContext(){
    return {
      droppable: this
    };
  },
  getInitialState(){
    return {
      draggedOver: false,
      validDrop: false
    };
  },
  onDragOver(e){
    stopEvent(e);
    e.dataTransfer.dropEffect = 'copy';
  },
  onDragEnter(e){
    var drag;
    stopEvent(e);
    if(this.context.drag){
      drag = this.context.drag.get();
      // if(drag.type)
    }
  },
  onDragLeave(e){
    stopEvent(e);
  },
  clear(){
    this.setState({
      draggedOver: false,
      validDrop: false
    });
  },
  onDrop(e){
    var data = e.dataTransfer.getData('idndo');
    data = ((typeof data === 'string') ? parse(data) : data);
    if(this.props.drop) {
      if(this.props.drop(data) !== false){  // return false from drop handler to stop propagation
        stopEvent(e);
      }
    }
  },
  render(){
    var props = {
      onDragOver: this.onDragOver,
      onDragEnter: this.onDragEnter,
      onDragLeave: this.onDragLeave,
      onDrop: this.onDrop,
      ...this.props
    };

    return React.createElement('div', props, this.props.children)
  }
});
