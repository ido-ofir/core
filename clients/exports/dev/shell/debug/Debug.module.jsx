var React = require('react');
var PropTypes = React.PropTypes;

var styles = require('./styles.js');
var core = require('core');

var tempStack = [];
var updating = false;

var arrowRight = String.fromCharCode(9658);
var arrowDown = String.fromCharCode(9662);
var returned = String.fromCharCode(10153);

function stringifyArray(obj, level){};
function stringify(obj, level){
  if(!(obj instanceof Object)) return obj;
  if(Array.isArray(obj)) return stringifyArray(obj, level);
  var prop, str = [arrayRight,'{'];
  for(var m in obj){
    if(m === 'children' || obj[m] instanceof Function) continue;
    prop = level ? stringify(obj[m], level - 1) : typeof obj[m];
    prop = prop ? prop.toString() : prop;
    str.push(`\n\t${m}:${prop}`);
    str.push(',')
  }
  if(str.length > 1) str.pop();
  str.push(str.length > 1 ? '\n}' : '}');
  return str.join('');
}
function format(d){
  function t(n){ return (n < 10) ? '0' + n : n;  }
  return `${t(d.getHours())}:${t(d.getMinutes())}:${t(d.getSeconds())}.${d.getMilliseconds()}`;
}

var Component = React.createClass({
  propTypes: {
    name: PropTypes.string
  },
  getInitialState(){
    return {
      nothing: (true)
    };
  },
  render() {
    var name = this.props.name;
    var style = styles.component;
    return (
      <div style={ style }>
        { name }
      </div>
    );
  }
});

var ObjectView = React.createClass({
  propTypes: {
    object: PropTypes.object
  },
  getInitialState(){
    return {
      isOpen: (false)
    };
  },
  open(){
    console.log('open');
    this.setState({
      isOpen: true
    });
  },
  close(){
    this.setState({
      isOpen: false
    });
  },
  renderItem(key){
    return <AnyView any={ this.props.object[key] }/>
  },
  render() {
    var object = this.props.object;
    var keys = Object.keys(object);
    if(!keys.length) return (<span>{}</span>);
    if(!this.isOpen) return (<span onClick={ this.open }>{ arrowRight + ' { ... }' }</span>);
    return (
      <span onClick={ this.open }>
        { arrowDown + ' { ' }
        { keys.map(this.renderItem) }
        { '}' }
      </span>
    );
  }
});
var ArrayView = React.createClass({
  propTypes: {
    array: PropTypes.array
  },
  getInitialState(){
    return {
      isOpen: (false)
    };
  },
  render() {
    var array = this.props.array;
    if(!array.length) return (<span>[]</span>);
    if(!this.isOpen) return (<span>{ arrayRight }[ ... ] { array.length }</span>);;
    return (
      <div>
        ok
      </div>
    );
  }
});

var AnyView = React.createClass({
  propTypes: {
    any: PropTypes.any
  },
  render() {
    var any = this.props.any;
    if(!any) return (<span>{ any }</span>);
    if(typeof any === 'object') {
      if(Array.isArray(any)) return (<ArrayView array={ any }/>)
      return (<ObjectView object={ any }/>)
    }
    return (
      null
    );
  }
});

var Item = React.createClass({
  propTypes: {
    item: PropTypes.object
  },
  onClick(e){
    e.stopPropagation();
    console.dir(this.props.item);
  },
  render() {
    var item = this.props.item;
    if(item.phase === 'invoked'){
      return (
        <div onClick={ this.onClick } style={{ display: 'flex' }}>

          <div style={{ flex: 1 }}>
            { item.name }.{ item.method }(<AnyView any={ item.data }/>)
          </div>
          <div style={{ flex: 1 }}>{ format(item.time) }</div>
        </div>
      );
    }
    return (
      <div onClick={ this.onClick } style={{ width: '100%'}}>
        { item.name }.{ item.method } { returned } <AnyView any={ item.data }/>
      </div>
    );
  }
});

core.Component('shell.Debug', {
  propTypes: {
    stack: PropTypes.array
  },
  getInitialState(){
    var stack = this.props.stack || [];
    var spread = this.spread(stack);
    var contexts = core.getContexts();
    var modules = [];
    var path, context, name;
    for(context in contexts){
      for(name in contexts[context]){
        if(context === 'orphand'){
          path = contexts[context][name];
        }
        else{
          modules.push({
            name: name,
            path: path
          });
          path = `${context}${contexts[context][name].substr(1)}`
        }

      }


    }
    // console.dir(spread);
    return {
      items: [],
      stack: [...stack],
      spread: spread,
      modules: modules
    };
  },
  setStack(stack){
    this.setState({
      stack: stack
    });
  },
  spread(stack){
    var comp, method, result = {};
    if(!stack) return result;
    for (var i = 0; i < stack.length; i++) {
      comp = result[stack[i].name];
      if(!comp){
        comp = result[stack[i].name] = {}
      }
      method = comp[stack[i].method];
      if(!method){
        method = comp[stack[i].method] = {}
      }
    }
    return result;
  },
  push(item){
    tempStack.unshift(item);
    if(!updating){
      updating = true;
      setTimeout(()=>{
        if(this.isMounted()){
          var stack = this.state.stack.concat(tempStack);
          this.setState({
            stack: stack,
            spread: this.spread(stack)
          });
          tempStack = [];
          updating = false;
        }
      }, 10);
    }

  },
  renderItem(item, index){
    return (
      <Item item={ item } key={ index }/>
    );
  },
  renderComponent(item, index){
    return (
      <Component name={ item } key={ index }/>
    );
  },
  renderModule(module){
    return (
      <div key={ module.name } style={{display: 'flex', borderBottom: '1px solid #ddd'}}>
        <div style={{ flex: 1}}>{ module.name }</div>
        <div style={{ flex: 1}}>{ module.path}</div>
      </div>
    );
  },
  render() {
    var components = this.state.spread;
    var names = Object.keys(components);
    return (
      <div style={ styles.wrap }>
        { this.state.modules.map(this.renderModule) }
      </div>
    );
  }
});
