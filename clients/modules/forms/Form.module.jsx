var React = require('react');
var { PropTypes } = React;
var core = require('core');
var validationMethods = require('./validationMethods.js');
//  findOrCreate({a: {b: 7, c: 8}}, ['a', 'c'])  => 8    // returns a.c if it exists
//  findOrCreate({a: {b: 7}}, ['a', 'c'])  => {}   // if a.c didn't exist, now it's an empty object
function findOrCreate(target, array){
  if(!array.length) return target;
  var field = array.shift();
  if(!target[field]) target[field] = {};
  return findOrCreate(target[field], array);
}


function find(target, array){
  if(!target || !array) return null;
  if(!array.length) return target || null;
  var field = array.shift();
  return find(target[field], array);
}

function set(target, path, value) {  // path is mutated
  if(!path.length) return value;
  var property = path.shift();
  var newVal = set(target[property], path, value);
  var result = target;
  if(newVal !== target[property]){
    result = Array.isArray(target) ? [] : {};
    for(var m in target){
      result[m] = target[m];
    }
    result[property] = newVal;
  }
  return result;
}

var schema = {
  name: { type: 'string', required: true, validations: [] },
  email: { type: 'string', required: true, validations: [{ type: 'email', text: 'email is not valid'} ] }
};

var formState = {
  name: { value: 'koko', isValid: true, isRequired: true },
  email: { value: 'aaa', isValid: false, isRequired: true, error: { type: 'email', text: 'email is not valid'} },
}

core.Component('forms.Form', [], ()=>{
  return {
     propTypes: {
       schema: PropTypes.object,
       onSubmit: PropTypes.func,
       onChange: PropTypes.func,
       data: PropTypes.object,
       silent: PropTypes.bool
     },
     getDefaultProps(){
       return {
         schema: {},
         data: {},
         silent: true
       };
     },
     childContextTypes: {
       form: PropTypes.object
     },
     getChildContext(){
       return {
         form: this
       };
     },
     getInitialState () {
       var data = this.props.data;
       var schema = this.props.schema;
       var state = this.makeFormState(schema, data)
       var form = {
           data: data,
           schema: schema,
           state: state,
           isValid: true,
           isPristine: true,
           isSilent: this.props.silent,
           isHalted: false
       };
       this.form = form;
       return form;
     },
     isValid(){ return this.form.isValid },
     isPristine(){ return this.form.isPristine },
     isSilent(){ return this.form.isSilent },
     isHalted(){ return this.form.isHalted },
     makeFormState(schema, data){
       var state = {};
       for(var m in schema){

       }
     },
     setFormState(state){
       var form = {};
       for(var m in this.form){
         form[m] = this.form[m];
       }
       for(var d in state){
         form[d] = state[d];
       }
       this.form = form;
       this.setState(form);
     },
     set(path, value){
       if(arguments.length === 1){  // passing only one argument will set all form data.
         value = path;
         path = [];
       }
       if(typeof path === 'string'){
          path = path.split('.');
       }
       var data = set(this.form.data, path, value);
       if(data !== this.form.data){
         this.setFormState({ data: data });
         this.validate();
       }
     },
     get(path){
       if(typeof path === 'string'){
          path = path.split('.');
       }
       return find(path, this.form.state) || '';
     },
     getData(){

     },

     validate(){

     },

     render() {
       return (
        <div style={this.props.style} id={ this.props.id }>
          { this.props.children }
        </div>
       );
     }
   };
});
