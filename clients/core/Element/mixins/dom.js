var React = require('react');

module.exports = {
  contextTypes: {
    app: React.PropTypes.object
  },
  componentDidMount(){
    this.context.app.dom.mount(this);
  },
  componentWillUnmount(){
    this.context.app.dom.unmount(this);
  }
};
