var React = require('react');
var core = require('core');
var PropTypes = React.PropTypes;

var DragColor = React.createClass({
  propTypes: {
    path: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  },
  onDragStart(e){
    e.stopPropagation();
    var drag = e.dataTransfer;
    drag.setData('text', `this.theme('${this.props.path}')`);
    drag.effectAllowed = 'copy';
  },
  render(){
    var style = {
      background: this.props.color,
      width: 30,
      height: 30,
      borderRadius: '50%',
      border: '1px solid #ddd',
      cursor: '-webkit-grab'
    }
    return (
      <div draggable={ true }
           onDragStart={ this.onDragStart }
           style={ style }>
        { this.props.children }
      </div>
    );
  }
})

core.Component('shell.Config', ['shell.Btn'], (Btn)=>{
  return {
    contextTypes: {
      app: PropTypes.object
    },
    getInitialState(){
      return {
        isOpen: (false)
      };
    },
    renderColor(path, color){
      return (
        <div key={ path } style={{ display: 'flex', alignItems: 'space-between' }}>
          <div style={{ flex: 1 }}>{ path }</div>
          <div style={{ display: 'flex' }}>
            <span style={{paddingRight: '10px'}}>{ color }</span>
            <DragColor color={ color } path={ path }/>
          </div>
        </div>
      );
    },
    renderThemeSection(name, theme){
      var children = [];
      for(var m in theme[name]){
        children.push(this.renderColor(`${name}.${m}`, theme[name][m]));
      }
      return (
        <div style={{ padding: 20 }}>
          <h3>{ name }</h3>
          { children }
        </div>
      );
    },
    render: function() {
      var config = this.context.app.config.get();
      if(!config) return null;
      var theme = config.theme;

      return (
        <div style={{ ...this.props.style }}>
          { this.renderThemeSection('colors', theme) }
          { this.renderThemeSection('backgrounds', theme) }
          { this.renderThemeSection('hovers', theme) }
          { this.renderThemeSection('active', theme) }
          { this.renderThemeSection('inactive', theme) }
        </div>
      );
    }
  };
});
