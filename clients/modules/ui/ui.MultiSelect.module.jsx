var React = require('react');
var pt = React.PropTypes;
var core = require('core');

var style = {

};

core.Component('ui.MultiSelect', ['ui.Card', 'ui.Icon', 'ui.ListItem'], (Card, Icon, ListItem)=>{
  return {
    propTypes: {
      options: pt.array
    },
    getInitialState(){
      return {
        isOpen: false
      };
    },
    events: {
      click: 'onClick',
      upKey: 'onUpKey',
      downKey: 'onDownKey'
    },
    onClick(){
      this.setState({ isOpen: false });
    },
    onUpKey(){
      this.setState({ isOpen: false });
    },
    onDownKey(){
      this.setState({ isOpen: false });
    },
    render: function() {
      return core.Repeater(
        <div { ...this.props } style={{ ...style, ...this.props.style }}>
        { this.props.children }
        </div>
      );
    }
  };
});
