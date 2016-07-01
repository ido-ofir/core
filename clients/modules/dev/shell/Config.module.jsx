var React = require('react');
var core = require('core');
var PropTypes = React.PropTypes;





core.Component('shell.Config.DragColor', ['ui.Color'], (Color)=>{
  return {
    propTypes: {
      path: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      onFineChange: PropTypes.func,
      onChange: PropTypes.func
    },
    onDragStart(e){
      e.stopPropagation();
      var drag = e.dataTransfer;
      drag.setData('text', `core.theme('${this.props.path}')`);
      drag.effectAllowed = 'copy';
    },
    onFineChange(val){
      core.set(`config.theme.${this.props.path}`, val);
    },
    onChange(val){},
    render(){
      var style = {
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '1px solid #ddd',
        cursor: '-webkit-grab',
        outline: 0
      }
      return (
        <Color draggable={ true }
             onDragStart={ this.onDragStart }
             style={ style }
             color={ this.props.color }
             onFineChange={ this.onFineChange }
             onChange={ this.onChange }>
          { this.props.children }
        </Color>
      );
    }
  };
});

core.Component('shell.Config', ['shell.Btn', 'shell.Config.DragColor'], (Btn, DragColor)=>{
  return {
    contextTypes: {
      app: PropTypes.object
    },
    getInitialState(){
      return {
        isOpen: (false)
      };
    },
    bindings: {
      theme: ['core', 'theme']
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
      var theme = this.state.theme;
      if(!theme) return null;

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
