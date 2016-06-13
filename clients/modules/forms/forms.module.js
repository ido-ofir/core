var core = require('core');

core.Module('forms', [
  'forms.Form',
  'forms.Input',
  'forms.Submit'
], (Form, Input, Submit)=>{

  return {
    Form: Form,
    Input: Input,
    Submit: Submit
  };

});
