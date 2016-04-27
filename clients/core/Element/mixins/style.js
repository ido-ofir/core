
/*
  listens for changes in app.style that involve props.className.
  sets state.style for use by the component
*/

var React = require('react');

function copy(from, to){
  for(var m in from){
    to[m] = from[m];
  }
}

module.exports = {
  contextTypes: {
    app: React.PropTypes.object
  },
  getInitialState(){
    var styles = {};
    var style = {};
    var className = this.props.className;
    var app = this.context.app;
    if(className) {
      className.split(' ').map((key) => {
        var s = app.style.get(key);
        styles[key] = s;
        copy(s, style);
      });
    }
    return {
      className: className,
      styles: styles,
      style: style
    };
  },
  componentDidMount(){
    var className = this.state.className;
    var app = this.context.app;
    if(!className) return;
    className.split(' ').map((key, index) => {
      app.style.on(key, this.onStyleChange);
    });
  },
  componentWillUnmount(){
    var className = this.state.className;
    var app = this.context.app;
    if(!className) return;
    className.split(' ').map((key, index) => {
      app.style.off(key, this.onStyleChange);
    });
  },
  onStyleChange(e){ // update state.styles and build new state.style
    var className = this.state.className;
    var styles = this.state.styles;
    var style = {};
    console.log('style change');
    console.dir(e);
    className.split(' ').map((key, index) => {
      if(key === e.selector){
        styles[key] = e.style;
      }
      if(styles[key]){
        copy(styles[key], style);
      }
    });
    this.setState({
      styles: styles,
      style: style
    });
  }
};
