var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');

core.Component('Parts.Ui', [
  'Parts.Buttons',
  'Parts.Icon',
  'Parts.Input',
  'Parts.TextArea',
  'Parts.Card',
  'Parts.ListItem',
  'Parts.Loader',
], (Buttons, Icon, Input, TextArea, Card, ListItem, Loader)=>{
  return {
    render(){
      return (
        <div style={{ padding: 15 }}>
          <Buttons/>
          <Input/>
          <TextArea/>
          <Card/>
          <ListItem/>
          <Loader/>
          <Icon match="font-awesome" include="fa"/>
        </div>
      );
    }
  };
})
