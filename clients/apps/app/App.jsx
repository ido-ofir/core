var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');
var Baobab = require('baobab');
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));

core.Style('box', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});



core.Action('test', {
  one: 'string',
  two: 'number!'
}, (data, promise)=>{
  promise.resolve('yey!');
});

core.on('error', (err)=>{
  console.error(err && (err.error || err));
});

core.Form('myForm', {
  inputs: {
    name: {
      type: "string",
      value: "@@@",
      required: true,
      validations: [
        (value, input, form)=>{
          if(value !== 'asd') return 'idiot';
        }
      ]
    },
    lastName: {
      type: "string",
      validations: [
        'max:8',
        'phone'
      ]
    }
  }
});

core.Component('TextField', [], ()=>{
  return {
    propTypes: {
      form: pt.string,
      name: pt.string
    },
    contextTypes: {
      form: pt.string
    },
    getInitialState(){
      var formName = this.props.form || this.context.form;
      var inputName = this.props.name;
      var path = ['core', 'forms', formName, 'inputs', inputName];
      this.watch({
        input: path
      });
      return {
        input: core.tree.get(path)
      };
    },
    onChange(e){
      var formName = this.props.form || this.context.form;
      var inputName = this.props.name;
      core.run(`core.forms.${formName}.set`, {
        name: inputName,
        value: e.target.value
      });
    },
    shouldComponentUpdate(nextProps, nextState){
      return (nextState.input !== this.state.input);
    },
    render(){
      var input = this.state.input;
      return (
        <TextField
          { ...this.props }
          name={ this.props.name }
          value={ input.value }
          onChange={ this.onChange }
          hintText={ input.placeholder }
          errorText={ input.error }
        />
      );
    }
  }
});

core.Component('Test', ['TextField'], (TextField)=> {
  return {
    bindings: {
      form: 'core.forms.myForm'
    },
    render(){
      var form = this.state.form;
      console.log('render');
      return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ flex: 1}}>
            <TextField form="myForm" name="name"/>
            <TextField form="myForm" name="lastName"/>
          </div>
          <pre style={{ flex: 1}}>
            { JSON.stringify(this.state.form, null, 4) }
          </pre>
        </div>
      );
    }
  };
})


core.loadContext(require.context('./', true, /.*\.module\.js/));

var element = document.getElementById('app');
core.require([
  'core.App', 'Test'], (App, Test)=>{

    core.connection.action('language.get', {}, (lang)=>{
      core.set('config.language', JSON.parse(lang));
      core.tree.commit();
      console.debug("getMuiTheme()", getMuiTheme());
      ReactDom.render(
        <App>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Test/>
          </MuiThemeProvider>

        </App>, element);

    }, core.error);

})
