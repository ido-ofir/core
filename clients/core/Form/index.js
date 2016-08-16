
var validationMethods = require('./validations.js');

module.exports = function(core){  // generates the 'Form' function

  var dummy = {
    errors: { 'koko': 'value must not exceed 8 characters' },
    isValid: true,
    isPristine: true,
    isSubmitted: false,
    isHalted: false,
    inputs: {
      'email': {
        type: 'string',
        value: '@gmail.com',
        required: (input, form)=>{
           return core.translate(`core.forms.required.input`, { input: input.name });
        },
        required: {
          'core.forms.required.input': { input: 'email' }
        },
        required: 'core.forms.required',
        required: true,
        validations: [
          // {'max:8': 'core.forms.validations.max'},
          // { name: 'max', arguments: [8] }
          // (value, input, form)=>{
          //    if(value > 8) return core.translate('core.forms.validations.max', {});
          // }
        ],
        dependsOn: [],
        isValid: true,
        isPristine: true,
        error: 'value must not exceed 8 characters'
      }
    }
  };

  function getInputError(value, input, form) {

    var validation, array, error;
    var required = input.required;

    if(required && (!value || value.length === 0)) {   // if required and empty
      if(typeof required === 'boolean'){               // if required is just a boolean, use default required message
        return core.translate('core.forms.required');
      }
      if(typeof required === 'string'){                // if required is a string, try to translate it
        return core.translate(required);
      }
      if(typeof required === 'object'){                // if required an object, it should have one property on it, which should be an object.
        var key = Object.keys(required)[0];            // this property's key will be translated with it's object value as context
        return core.translate(key, required[key]);
      }
      if(typeof required === 'function'){              // if required is a function,
        return required(input, form);                  // it should return the correctly translated string
      }
    }

    if(input.validations){                             // cycle all validations until one fails
      for (var i = 0; i < input.validations.length; i++) {
        validation = input.validations[i];
        if(typeof validation === 'string'){            // if validation is a string, as in 'max:8', convert it to an object
          array = validation.split(':');
          validation = { name: array.shift(), arguments: array };
        }
        if(typeof validation === 'object'){            // if validation is an object,
          if(!core.validations[validation.name]){      // it's referencing a validation on core.validations.
            throw new Error(`cannot find validation '${validation.name}'`);
          }
          validation = core.validations[validation.name].apply(core.validations, validation.arguments);
        }
        if(!(validation instanceof Function)){         // if it's not a function here, it's of wrong type.
          throw new Error(`validation is not a function`);
        }
        else{                                          // the validation function should return the correctly translated
          return validation(value, input, form);       // error string if it fails
        }
      }
    }
  }

  // gets the cursor for a form by name.
  function getFormCursor(form) {

    var formMatch = core.isString(form) ? { name: form } : form;
    var path = ['core', 'forms', formMatch];
    var formCursor = core.tree.select(path);

    if(!formCursor.exists()) throw new Error(`cannot find form ${form}`);

    return formCursor;
  }

  // takes a form name and an input name, finds and returns their cursors.
  function getCursors(form, input) {

    var formCursor = getFormCursor(form);

    var inputCursor = formCursor.select('inputs').select(input.split('.'));
    if(!inputCursor.exists()) throw new Error(`cannot find input ${input}`);

    return {
      input: inputCursor,
      form: formCursor
    };
  }

  // runs validations for the input, sets 'error', 'isValid', and 'isPrestine' on the input.
  function validateInput(cursors, value) {

    var form = cursors.form.get();
    var input = cursors.input.get();
    var error = getInputError(input.value, input, form) || null;
    var isValid = !error;

    cursors.input.set('error', error);
    cursors.input.set('isValid', isValid);
    cursors.input.set('isPristine', false);

    return error;
  }

  // validates the form by checking if there are any errors left. sets 'isValid' and 'isPristine' on the form.
  function validateForm(cursors) {

    var errors = cursors.form.get('errors');
    var formIsValid = Object.keys(errors).length === 0;

    cursors.form.set('isValid', formIsValid);
    cursors.form.set('isPristine', false);

    return formIsValid;
  }

  function setInput(formName, inputName, eventOrValue) {

    var target, value = null;
    if(eventOrValue && eventOrValue.target){
      target = eventOrValue.target;
      if('value' in target){ value = target.value; }
      else if('checked' in target){ value = target.checked; }
      else if('selected' in target){ value = target.selected; }
    }
    else{
      value = eventOrValue;
    }
    core.run(`core.forms.set`, {
      form: formName,
      input: inputName,
      value: value
    });
  }

  function pushToInput(formName, inputName, value) {
    core.run(`core.forms.push`, {
      form: formName,
      input: inputName,
      value: value
    });
  }

  function deleteFromInput(formName, inputName, value) {
    core.run(`core.forms.delete`, {
      form: formName,
      input: inputName,
      value: value
    });
  }

  // sets default values for the form and it's inputs, sets initial form data and stores the definition for a reset.
  function initializeForm(formName, definition) {

    // clone the original definition and set defaults
    var form = { ...definition, name: formName };
    if(!form.errors) form.errors = {};
    if(!form.inputs) form.inputs = {};
    if(!('isValid' in form)) form.isValid = true;
    if(!('isPristine' in form)) form.isPristine = true;
    if(!('isSubmitted' in form)) form.isSubmitted = false;
    if(!('isHalted' in form)) form.isHalted = false;

    // clone each original input and add defaults to it
    var input, inputs = { ...form.inputs };
    var namespace;
    for(var inputName in inputs){
      input = { ...inputs[inputName] };
      input.name = inputName;
      if(!('value' in input)) input.value = '';
      if(!('error' in input)) input.error = null;
      if(!('isPristine' in input)) input.isPristine = true;
      if(!('isValid' in input)) input.isValid = true;
      input.set = setInput.bind(input, formName, inputName);
      input.push = pushToInput.bind(input, formName, inputName);
      input.delete = deleteFromInput.bind(input, formName, inputName);
      inputs[inputName] = input;
    }
    form.inputs = inputs;
    form.definition = definition;
    form.data = getFormData(form);

    return form;
  }

  function getFormData(form) {
    var data = {};
    for(var name in form.inputs){
      data = core.utils.set(data, name, form.inputs[name].value);
    }
    return data;
  }

  function setFormData(formCursor, inputName, value) {
    var path = inputName.split('.');
    formCursor.select('data').select(path).set(value);
  }
  // defining an action to set a value on the form.
  core.Action(`core.forms.set`, {
    form: 'string ~ object!',
    input: 'string!',
    value: 'any!'
  }, ({ form, input, value }, promise) => {

    var cursors = getCursors(form, input);
    cursors.input.set('value', value);

    setFormData(cursors.form, input, value);
    var error = validateInput(cursors);

    // set or unset this input's error in the form's errors object
    var formError = cursors.form.select('errors', input);
    if(error) formError.set(error);
    else formError.unset();

    var formIsValid = validateForm(cursors);

    // commit the tree and return the value
    core.tree.commit();
    promise.resolve(formIsValid);

  });

  // push an item to an array
  core.Action(`core.forms.push`, {
    form: 'string ~ object!',
    input: 'string!',
    value: 'any!'
  }, ({ form, input, value }, promise)=>{

    var cursors = getCursors(form, input);
    var array = cursors.input.get('value');
    if(!core.isArray(array)){
      throw new Error(`cannot push to input ${input}. it is of type '${core.typeOf(array)}'`);
    }
    cursors.input.push('value', value);
    setFormData(cursors.form, input, cursors.input.get('value'));
    var error = validateInput(cursors);

    // set or unset this input's error in the form's errors object
    var formError = cursors.form.select('errors', input);
    if(error) formError.set(error);
    else if(formError.exists()) formError.unset();

    var formIsValid = validateForm(cursors);

    // commit the tree and return the value
    core.tree.commit();
    promise.resolve(formIsValid);

  });

  // delete an item from an array
  core.Action(`core.forms.delete`, {
    form: 'string ~ object!',
    input: 'string!',
    value: 'any!'
  }, ({ form, input, value }, promise)=>{

    var cursors = getCursors(form, input);
    var array = cursors.input.get('value');
    var itemCursor, formError, formIsValid, error;

    if(!core.isArray(array)){
      throw new Error(`cannot push to input ${input}. it is of type '${core.typeOf(array)}'`);
    }
    itemCursor = cursors.input.select(['value', value]);
    if(itemCursor.exists()) itemCursor.unset();
    setFormData(cursors.form, input, cursors.input.get('value'));
    error = validateInput(cursors);

    // set or unset this input's error in the form's errors object
    formError = cursors.form.select('errors', input);
    if(error) formError.set(error);
    else if(formError.exists()) formError.unset();

    formIsValid = validateForm(cursors);

    // commit the tree and return the value
    core.tree.commit();
    promise.resolve(formIsValid);

  });

  // reset the form to the original definition
  core.Action(`core.forms.reset`, {
    form: 'string ~ object!'
  }, ({ form })=>{
    var formCursor = getFormCursor(form);
  });

  // submit the form
  core.Action(`core.forms.submit`, function(data, promise){

    var form = formCursor.get();
    if(!form.isValid){
      return promise.reject();
    }
    formCursor.set('isSubmitted', true);

  });

  return function Form(formName, definition){  // defines a form on the tree and sets up default values.

    var formsCursor = core.tree.select(['core', 'forms']);
    var form = initializeForm(formName, definition);

    var existing = formsCursor.select({ name: formName });
    if(existing.exists()){
      existing.set(form);
    }
    else{
      formsCursor.push(form);
    }
  };
};
