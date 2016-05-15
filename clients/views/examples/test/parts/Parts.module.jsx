var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');

var styles = {
  part: {
    border: '1px solid #ddd'
  }
};

function except(source, ...properties) {
  var result = {};
  for(var m in source){
    if(properties.indexOf(m) === -1) result[m] = source[m];
  }
  return result;
}

core.Style('box', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});

core.Style('red', {
  background: 'red'
});

core.Style('border', {
  border: '1px solid #ddd',
  borderRadius: 4
});
core.Style('pad-40', {
  padding: 40,
});
core.Style('scroll', {
  overflow: 'auto'
});

core.Directive('if', [], ()=>{
  return (value, props, element)=>{
    if(typeof value === 'string'){
      if(!element.owner.state[value]) return null;
    }
    else if(!value) return null;
    return props;
  };
});

core.Directive('styles', [], ()=>{
  return (value, props, element)=>{
    var style = { ...props.style };
    value.split(' ').map((name)=>{
      var coreStyle = core.styles[name];
      if(!coreStyle) return console.error(`core styles directive cannot find style ${name}`);
      for(var rule in coreStyle){
        style[rule] = coreStyle[rule];
      }
    });
    var newProps = except(props, 'style', 'styles');
    newProps.style= style;
    return newProps;
  };
});

core.Directive('repeat', [], ()=>{
  return (value, props, element)=>{
    if(typeof value === 'string'){
      var owner = element.owner;
      var result = [];
      var target = owner.state[value];
      var cleanProps = except(props, 'repeat');
      console.debug("element.children", element.children);
      if(Array.isArray(target)){
        result = target.map((item, i)=>{
          return owner.createElement(element.type, { ...cleanProps, key: i }, ...element.children);
        });
        return result;
      }
    }
    return props;
  };
});



module.exports = core.Component('Parts', [
  'ui',
  'ui.Button',
  'divide.Horizontal',
  'divide.Vertical',
  'Run'
], (ui, Button, Horizontal, Vertical, Run)=>{

  return {
    contextTypes: {
      app: React.PropTypes.object
    },
    componentDidMount(){
      this.context.app.connection.action('app.config', {}, (config)=>{
        this.context.app.set('core.app.config', config);
      });
    },
    getInitialState(){
      return {
        isOpen: false,
        items: [1,2,3]
      };
    },
    renderPart(name, part){
      return (
        <div key={ name }>
          <div>{ name }</div>
          <div>{ part.description }</div>
          <div style={ styles.part }>
            { React.createElement(part.component, part.props || {}) }
          </div>
        </div>
      );
    },
    render(){
      var children = [];
      // for(var m in parts){
      //   children.push(this.renderPart(m, parts[m]))
      // }
      return (
        <div styles="box pad-40 scroll">
          <button onClick={()=>{ this.setState({ isOpen: !this.state.isOpen })}}>
              toggle
          </button>
          <div if="isOpen"
               styles="red border"
               style={{ background: 'green' }}> wowaa </div>
             <div repeat="item in items">
               <div>ok [[ item ]]</div>
             </div>
             <Run style={{ top: 160, border: '1px solid #ddd'}}/>
        </div>
      );
    }
  };
});
