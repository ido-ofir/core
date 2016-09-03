
var core = require('core');

core.require(['ui.Input', 'FormError'], (Input, FormError)=>{

  core.Input('FormInput', ({ input, ...props })=>
    <div>
      <Input
        value={ input.value }
        onChange={ input.set }
        placeholder={ input.placeholder }
        { ...props }
      />
      <FormError>{ input.error }</FormError>
    </div>
  );

});
