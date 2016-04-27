var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');

core.Component('Parts.Ui', [
  'Parts.Buttons'
], (Buttons)=>{
  return {
    render(){
      return (
        <div style={{ padding: 15 }}>
          <Buttons/>
        </div>
      );
    }
  };
})
