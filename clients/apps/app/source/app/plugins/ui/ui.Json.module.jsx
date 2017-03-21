var React = require('react');
var core = require('core');

core.Component('ui.Json', ['ui.Pre'], (Pre)=>{
  return {
    shouldComponentUpdate(nextProps){
      return nextProps.children !== this.props.children;
    },
    render: function() {
      return (
        <Pre { ...this.props }>
        { JSON.stringify(this.props.children) }
        </Pre>
      );
    }
  };
});
