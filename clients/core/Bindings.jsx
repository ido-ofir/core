
var React = require('react');
var { PropTypes } = React;

var Bindings = React.createClass({
  propTypes: {
    bindings: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    render: PropTypes.func,
    tree: PropTypes.object.isRequired
  },
  getInitialState(){
    var bindings = this.props.bindings;
    if(!bindings) return null;
    if(typeof bindings === 'string'){
      bindings = [bindings];
    }
    if(Array.isArray(bindings)){
      this.isSingle = true;
      bindings = { item: bindings }
    }
    return this.watch(bindings);
  },
  watch(bindings){
    if(this.watcher){
      this.watcher.off('update', this.updateBindings);
    }
    var watcher = this.watcher = this.props.tree.watch(bindings);
    watcher.on('update', this.updateBindings);
    return watcher.get();
  },
  updateBindings(){
    if(this.watcher){
      this.setState(this.watcher.get());
    }
  },
  render(){
    var data = this.isSingle ? this.state.item : this.state;
    var render = this.props.render || this.props.children;
    var rendered = render(data);
    return rendered || null;
  }
});

module.exports = Bindings;
