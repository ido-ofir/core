var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');
var sa = require('superagent');
var Baobab = require('baobab');
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));
core.loadContext('dev-client', require.context('./dev-client', true, /.*\.module\.js/));



core.Action('test', {
  one: {
    type: 'string',
    required: true,
    description: 'the one argument'
  },
  two: 'number!'
}, (data, promise)=>{
  promise.resolve('yey!');
});

core.on('error', (err)=>{
  console.error(err && (err.error || err));
});

// core.on('click', ()=>{ console.log('click'); })
// core.on('mouseUp', ()=>{ console.log('mouseUp'); })
// core.on('esc', ()=>{ console.log('esc'); })

core.Form('form', {
  inputs: {
    name: {
      type: "string",
      required: true
    },
    lastName: {
      type: "string",
      required: true
    },
    validations: {
      type: "array",
      value: []
    }
  }
});

core.Input('TextField', ({ input, ...props })=> {
  return (
    <TextField
      value={ input.value }
      onChange={ input.set }
      hintText={ input.placeholder }
      errorText={ input.error }
      { ...props }
    />
  );
});

core.Input('MultiSelect',['ui.Select', 'ui.Input', 'ui.Icon'],  (Select, Input, Icon)=>{


      return {
        propTypes: {
          input: pt.object
        },
        onSelect(value){
          var input = this.props.input.push(value);
        },
        render(){
          var input = this.props.input;
          return (
            <div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, position: 'relative' }}>
                  <TextField form="otherForm" name="name" style={{ flex: 1, width: '100%'}}/>
                    <Select options={['four', 'two', 'three']} onSelect={ this.onSelect }>
                      {
                        (select) => {
                          return (<Icon className="fa fa-plus" active={ select.state.isOpen }/>);
                        }
                      }
                    </Select>

                </div>
              </div>
            </div>
          );
        }
    };
});

core.Component('a', ({ children }) => <div> page a { children }</div>);
core.Component('b', ({ children }) => <div> page b { children }</div>);
core.Component('c', ({ children }) => <div> page c { children }</div>);


core.Component('Test', ['TextField', 'MultiSelect', 'ui.Select', 'core.Bindings', ], (TextField, MultiSelect, Select, Bindings)=> {
  return {
    render(){
      console.log('render');
      // console.debug("form", form);
      return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ flex: 1}}>
            <TextField form="otherForm" name="name"/>
            <MultiSelect form="otherForm" name="lastName"/>
            {
              core.bind('stuff', stuff => <div>{ stuff }</div>)
            }
            {
              core.input('lastName', 'otherForm', input =>
                <div>
                  { input.value.map((item, index) => <div key={ index } onClick={ e => input.delete(index) }>{ item }</div>) }
                </div>
              )
            }
            <Bindings bindings="stuff">
              { stuff => <div>{ stuff }</div> }
            </Bindings>
            { core.router.render() }
          </div>
          {
            core.bind(['core','router'], router =>

              <pre style={{ flex: 1, overflow: 'auto' }}>
                { JSON.stringify(router, null, 4) }
              </pre>

            )
          }

        </div>
      );
    }
  };
})


core.loadContext(require.context('./', true, /.*\.module\.js/));

var element = document.getElementById('app');
core.require([
  'core.App', 'DevTools'], (App, DevTools)=>{
    core.loadLanguage('default').then(()=>{
      ReactDom.render(
        <App>
          <DevTools/>
        </App>, element);
    });
})
