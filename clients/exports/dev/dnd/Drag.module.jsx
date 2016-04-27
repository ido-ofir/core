
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

core.Component('dnd.Drag', {
  propTypes: {
    data: PropTypes.object.isRequired,
    cancel: PropTypes.bool
  },
  onDragStart(e){
    if(this.props.cancel) return e.stopPropagation();
    var drag = e.dataTransfer;
    var data = this.props.data;
    drag.setData('idndo', JSON.stringify(data));
    drag.effectAllowed = 'copy';
  },
  render(){
    return (
      <div draggable={ true } onDragStart={ this.onDragStart } { ...this.props }>
        { this.props.children }
      </div>
    );
  }
});
