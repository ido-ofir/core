
  var core = require('core');

  core.Component('DefiningInputs', [
    'FormInput',
    'FormError',
    'ui'
  ], (FormInput, FormError, ui)=> {

    var { Select, Icon, Input, Button, Json, CheckBox, Pre } = ui;

    return {
      render(){
        // console.debug("form", form);
        return (
          <div style={{ padding: '10px', lineHeight: '30px', color: '#444', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '100%' }}>


            <div style={{ flex: 1, padding: '10px', overflow: 'auto'}}>


              <div>
                Define a form in the coreObject:
                <Pre>
                  {
  `
  window.__coreObject = {
    ...

      "forms": [
          {
              "name": "addContact",
              "inputs": { ... }
          }
      ]

    ...
  };
  `
                  }
                </Pre>
  then define an input by it's name:
                <Pre>
                  {
  `
  ...
  "name": "addContact",
  "inputs": {
    "firstName": {
        "type": "string",
        "label": "Name",
        "value": "",
        "required": true
    }
  }
  ...
  `
                  }
                </Pre>
              </div>
              <div>
                Rendering:
              <Pre>
                {
`
core.input('name', 'addContact', input =>
  <div>
    <div>{ input.label }</div>
    <Input
      value={ input.value }
      onChange={ input.set }
      placeholder={ input.placeholder }/>
    <FormError>{ input.error }</FormError>
  </div>
)
`
                }
              </Pre>
              </div>
              {
                core.input('name', 'addContact', input =>
                  <div>
                    <div>{ input.label }</div>
                    <Input
                      value={ input.value }
                      onChange={ input.set }
                      placeholder={ input.placeholder }/>
                    <FormError>{ input.error }</FormError>
                  </div>
                )
              }
              <FormInput form="addContact" name="name" style={{ flex: 1, width: '100%'}}/>
          </div>
          </div>
        );
      }
    };
  });
