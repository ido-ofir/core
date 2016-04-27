var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');

core.Component('Parts.Ui', [
  'Parts.Buttons',
  'Parts.Icon'
], (Buttons, Icon)=>{
  return {
    render(){
      return (
        <div style={{ padding: 15 }}>
          <Buttons/>
          <Icon match="font-awesome" include="fa"/>
        </div>
      );
    }
  };
})
