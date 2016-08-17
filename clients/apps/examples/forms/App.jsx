var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');
var Baobab = require('baobab');

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));
// core.loadContext('dev-client', require.context('./dev-client', true, /.*\.module\.js/));



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


core.require('ui.Input', (Input)=>{

  core.Input('TextField', ({ input, ...props })=>
    <div>
      <Input
        value={ input.value }
        onChange={ input.set }
        placeholder={ input.placeholder }
        { ...props }
      />
      <div style={{ height: 20, lineHeight: '20px', fontSize: '12px', color: '#f00' }}>{ input.error }</div>
    </div>
  );

});

core.Component('Test', [
  'TextField',
  'ui.Select',
  'ui.Icon',
  'ui.Input',
  'ui.Button',
  'ui.Json'], (TextField, Select, Icon, Input, Button, Json)=> {
  return {
    render(){
      // console.debug("form", form);
      return (
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ flex: 1, padding: '10px', overflow: 'auto'}}>

            <TextField form="otherForm" name="name" style={{ flex: 1, width: '100%'}}/>
            <Button>Hello</Button>
            {
              core.input('lastName', 'otherForm', input =>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, position: 'relative' }}>
                      <div>Array</div>
                      <Select options={ input.options.filter(opt => input.value.indexOf(opt) === -1) } onSelect={ input.push }>
                        {
                          (select) => <Icon className="fa fa-plus" disabled={ input.value.length === input.options.length } active={ select.state.isOpen }/>
                        }
                      </Select>

                  </div>
                  <div style={{ border: '1px solid #ddd', borderRadius: '4px', minHeight: '30px'}}>
                    {
                      input.value.map((item, i) =>
                        <div key={ i } style={{ display: 'flex', padding: '0 6px', lineHeight: '30px' }}>
                          <div style={{ flex: 1 }}>{ item }</div>
                          <Icon className="fa fa-close" onClick={ e => input.delete(i) }/>
                        </div>
                      )
                    }
                  </div>
                </div>
              )
            }
            <div>
              {
                core.collection('list', list =>
                  <div>
                    <div>List</div>
                      {
                        core.value('test', test =>
                          <div style={{ display: 'flex'}}>
                            <Input value={ test.value } onChange={ e => test.set(e.target.value) }/>
                            <Icon className="fa fa-plus" onClick={ e => list.push(test.value) }/>
                          </div>

                        )
                      }
                      {
                        list.items.map((item, i) =>
                          <div key={ i } style={{ display: 'flex' }}>
                            <div>{ item }</div>
                          </div>
                        )
                      }
                  </div>
                )
              }
            </div>
          </div>
          <div style={{ flex: 1, padding: '10px', display: 'flex' }}>
          {
            core.bind(['core', 'forms', { name: 'otherForm' }], otherForm =>

              <pre style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
                { JSON.stringify(otherForm, null, 4) }
              </pre>

            )
          }
          </div>
        </div>
      );
    }
  };
})


core.loadContext(require.context('./', true, /.*\.module\.js/));
var element = document.getElementById('app');
core.require([
  'core.App', 'Test'], (App, Test)=>{
    console.log(1);
    core.loadLanguage('default').then(()=>{
      console.log(5);
      ReactDom.render(
          <App>
            <Test/>
          </App>, element);
    });

})
