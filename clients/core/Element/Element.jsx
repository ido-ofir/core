
var React = require('react');
var pt = React.PropTypes;

var Element = React.createClass({
  propTypes: {
    bindings: pt.object,
    type: pt.oneOfType([pt.func, pt.string]),
    path: pt.string
  },
  render(){
    var type = core.components[this.props.type];
    if(!type) type = this.props.type;
    return core.createElement(type, props, children.map(this.renderChild));
  }
});

module.exports = Element;
