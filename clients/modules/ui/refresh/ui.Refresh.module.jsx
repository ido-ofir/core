var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
require('./ui.refresh.scss');

core.Component('ui.Refresh', ['ui.Icon'], (Icon)=>{
  return {
    propTypes: {
      refreshing: PropTypes.bool,
      action: PropTypes.string,
      onClick: PropTypes.func,
      actionData: PropTypes.any
    },
    onClick(e){
      if(this.props.action){
        core.action(this.props.action, this.props.actionData);
      }
      if(this.props.onClick){
        this.props.onClick(e);
      }
    },
    render: function() {

      var className = 'button-refresh fa fa-refresh';
      if(this.props.refreshing) className += ' button-refresh-refreshing';

      return (
        <Icon className={ className } onClick={ this.onClick }/>
      );
    }
  }
});
