var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');
var Baobab = require('baobab');

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));

core.Style('box', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});

core.Form('myForm', {
  inputs: {
    "name": {
      type: "string",
      value: "koko"
    }
  }
});

core.Component('Test', {
  bindings: {
    form: 'core.forms.myForm'
  },
  forms: {
    myForm: { } // options object
  },
  render(){
    var form = this.state.form;
    var name = form.inputs.name;
    return (
      <div>{ name.value }</div>
    );
  }
})


core.loadContext(require.context('./', true, /.*\.module\.js/));

var element = document.getElementById('app');
core.require([
  'core.App', 'Test'], (App, Test)=>{
  ReactDom.render(
    <App>
      <Test/>

    </App>, element);
})
