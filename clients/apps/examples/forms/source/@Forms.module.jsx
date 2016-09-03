var core = require('core');

core.Component('Forms', [
  'FormInput',
  'FormError',
  'DefiningInputs',
  'ui'
], (FormInput, FormError, DefiningInputs, ui)=> {

    var { Select, Icon, Input, Button, Json, CheckBox, Pre } = ui;
  return {
    render(){
      // console.debug("form", form);
      return (
        <div style={{ padding: '10px', lineHeight: '30px', color: '#444', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '100%' }}>


          <div style={{ flex: 1, padding: '10px', overflow: 'auto'}}>


            <DefiningInputs/>
            Text input
            <FormInput form="addContact" name="name" style={{ flex: 1, width: '100%'}}/>
            <Pre>
              {
                `

                `
              }
            </Pre>

            {
              core.input('terms', 'addContact', input =>
                <div>
                  <CheckBox checked={ input.value } onChange={ input.set }/>
                  <FormError>{ input.error }</FormError>
                </div>
              )
            }
            {
              core.input('lastName', 'addContact', input =>
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
            core.bind(['core', 'forms', { name: 'addContact' }], addContact =>

              <pre style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
                { JSON.stringify(addContact, null, 4) }
              </pre>

            )
          }
          </div>
        </div>
      );
    }
  };
});



// core.on('click', ()=>{ console.log('click'); })
// core.on('mouseUp', ()=>{ console.log('mouseUp'); })
// core.on('esc', ()=>{ console.log('esc'); })
