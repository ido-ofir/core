
var React = require('react');
var PropTypes = React.PropTypes;

/*
  Element component
  ====================
  renders components recursivly from a json object.
  example json: {
    type: 'div',
    props: { ... },
    children: []
  }
  the element exposes itself through context as 'element'

*/



// (['a', 'b'], {a: { b: 'c'}})  => 'c'
function findInContext(path, context){
  if(!context) return;
  var field = path.shift();
  var target = context[field];
  if(!path.length) return target;
  return findInContext(path, target);
}

function parseString(string, context){
  if(typeof string !== 'string') return string;
  var start = string.indexOf('{{');
  var end = string.indexOf('}}');
  var value;
  if(start === -1 || end === -1) return string;
  var expression = string.slice(start + 2, end).trim();
  if(expression){
    value = findInContext(expression.split('.'), context);
  }
  if(value === undefined){
    return string;
  }
  return string.slice(0, start) + value + string.slice(end + 2);
}

function shallowParseObject(obj, context){
  var result = {};
  for(var m in obj){
    result[m] = (typeof obj[m] === 'string') ? parseString(obj[m], context) : obj[m];
  }
  return result;
}

var Element = React.createClass({
  propTypes: {
    cursor: PropTypes.object,
    path: PropTypes.string
  },
  contextTypes: {
    component: PropTypes.object,
    components: PropTypes.object
  },
  childContextTypes: {
    element: PropTypes.object,
  },
  getChildContext(){
    return {
      element: this
    };
  },
  getInitialState(){
    return {
      element: this.props.cursor.get()
    }
  },
  componentDidMount(){
    this.props.cursor.on('update', this.update);
  },
  componentWillUnmount(){
    this.props.cursor.off('update', this.update);
  },
  update(e){
    this.setState({
      element: e.data.currentData
    });
  },
  close(){
    this.props.cursor.set(null);
  },
  renderChild(element, i){
      if(typeof element !== 'object') return element;
      var path = this.props.path || '0';
      return (
        <Element cursor={ this.props.cursor.select('children', i) } key={ i } path={ `${path}.${i}` }/>
      );
  },
  render(){
    var element = this.state.element;
    var component = this.context.component;
    if(!element) return null;
    var type = this.context.components[element.type];
    if(!type) type = element.type;
    var props = shallowParseObject(element.props || {}, this);
    if(props.style){
      if(component && component.theme){
        props.style = shallowParseObject(props.style, component.theme);
      }
    }
    var children = element.children || [];
    return React.createElement(type, props, children.map(this.renderChild));
  }
});

module.exports = Element;
