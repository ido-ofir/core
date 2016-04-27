
## Forms
A small set of basic form components to normalize form submittions through koko.
### Features
* Local and remote field validations.
* Form submit can automatically call a server side action, and return the result.  
* Transparent and visible validations.

### Components
* #### Form
The main form component.
 exposes himself as `form` in the context, which make him serve as an api for all child inputs.

 * ##### Inputs
The form keeps a reference to each of it's child inputs in an object called `inputs`, defined on the component, which is initially empty. so in the component definition we create an empty object:
```
inputs: {}
```
we then save each input that registers with the form using it's name prop. for example, if `input` is an input component:
```
this.inputs[input.props.name] = input;
```
 * ##### Context
   * **form** - the entire interaction of form inputs with the form is managed through `this.context.form`, which is just a reference to the actual form component:
```js
   getChildContext(){
        return {
            form: this
        };
    }
```
so child input components can call methods on the parent form component.

     they would then use this reference to register themselves with the form as they come on screen, because it's actually the form that needs to have a reference to it's child inputs.
 * ##### Props
   * **data** ( Object ) - the initial form data to load.
   * **onSubmit** ( Function ) - a callback to run when the form has passed all local validations. if an action prop is defined, onSelect will run before sending the actual request to the server, and if it returns false the action will be canceled.
   * **action** ( String ) - the name of a server side action to run on form submit.
 * ##### Methods
   * `addInput(input)` - get a reference to a child input element. an input would call this method like this:
```
componentWillMount(){
          this.context.form.addInput(this)
}
```
   * `removeInput(input)` - remove a reference to a child input element. an input would call this method like this:
```
componentWillUnmount(){
          this.context.form.removeInput(this)
}
```
   * `validate()` - the name of a server side action to run on form submit.
   * `invalidate(rejects)` - 
   * `submit(silent)` starts the validation sequence for all inputs. you can call this method from a child input (a submit button) by calling `this.context.form.submit()`.
* #### Input
A basic input component for any input that can be captured with `e.target.value`.

 Uses the `input` mixin (see below).
 * ##### Props
   * **name** ( String ) - the name of the input. (**Required**)
   * **placeholder** ( String ) - the placeholder will display it self inside the input field  if it is empty .
   * **required** ( String ) - the form will display this string below the input field if the input is empty.
   * **validations** ( Object ) - pass a set of validations and error alerts. if the input is not valid the form will display the right alert below the input field. 

     example:
```
  var validations = {'email': 'please enter a valid email'};
```
```
  <Input name="myInput" placeholder="placeholder" validations={validations} required="please fill out this field"/>
```

* #### Select
A select component that receives an array of objects and renders them as select options.

 Uses the `input` mixin (see below).
 * ##### Props
   * **name** ( String ) - the name of the select. this will be the name of the field in the submitted form (**Required**)
   * **placeholder** ( String ) - the placeholder will display it self above the select field if no option is selected.
   * **required** ( String ) - the form will display this string below the select field if no option is selected.
   * **options** ( Object ) - pass an array of options to display inside the select component. (**Required**)
    * **display** ( String ) - define which property of each option will be displayed in the select. (**default: "name"**)
   * **set** ( String ) - define which property of an option will be set when that option is selected. (**default: "id"**)
   * **multi** ( String ) - define if the select component is a multiple select or a single value select. (**default: "false"**)
   * **disable** ( String ) - define if the select component is disable or not. (**default: "false"**)
   * **allowCreate** ( String ) - define if the user can add a new values that not exist in the options array. (**default: "false"**)
   * **clearable** ( String ) - if 'clearable' is true a small **X** icon will appear on the select top input bar. on click all the selected options will be deselect.  . (**default: "true"**)
   * **searchable** ( String ) - define if the select component is searchable by enter a value on the select top input bar. (**default: "true"**)
   * **isLoading** ( String ) - when true, a loading animated icon will appear until 'isLoading' will turn back to false. use when waiting for a options array from server  (**default: "false"**)
   * **optionRenderer** ( String ) - optionRenderer expect a function that return a single view for every option. use if you want to display a unique style inside the select options box.

     example:
```
var interests = [
       { 'name': 'sport', 'id': 'sport_id' },
       { 'name': 'music', 'id': 'music_id' },
       { 'name': 'art', 'id': 'art_id' }
    ];
    var display = 'name';
    var set = 'id';
```
```
   <SmartSelect name="interestsSelect" options={interests} multi={true} placeholder="choose interests" display={display} set={set} value={"italy_id"} required="please select one of the options"/>
```

* #### RadioGroup
A radioGroup component that receives an array of objects and renders them as radio options.

 Uses the `input` mixin (see below).
 * ##### Props
   * **name** ( String ) - the name of the radioGroup. this will be the name of the field in the submitted form (**Required**)
   * **required** ( String ) - the form will display this string below the radioGroup field if no option is selected.
   * **options** ( Object ) - pass an array of options to display inside the radioGroup component. (**Required**)
    * **display** ( String ) - define which property of each option will be displayed in the radioGroup. (**default: "name"**)
   * **set** ( String ) - define which property of an option will be set when that option is selected. (**default: "id"**)

     example:
```
var optionsRario = [{
      'name': 'one',
      'id': '1'
    },{
      'name': 'two',
      'id': '2'
    },{
      'name': 'three',
      'id': '3'
    }];
    var display = 'name';
    var set = 'id';
```
```
            <RadioGroup name="myRadioButton" options={optionsRario} display={display} set={set} required="please select one of the options"/>
```


* #### CheckBox
A basic checkbox component.

 Uses the `input` mixin (see below).
 * ##### Props
   * **name** ( String ) - the name of the checkbox. this will be the name of the field in the submitted form (**Required**)
   * **label** ( String ) - the label will display it self on the right side to the checkbox.

     example:
```
    <CheckBox name="myChackBox" label="click"/>
```

* #### GapDatePickers
this component is a combination of two date Pickers that produce two dates with a gap between them. ('from - to' pattern).   

 Uses the `input` mixin (see below).
 * ##### Props
   * **name** ( String ) - the name of the component. this will be the name of the field in the submitted form (**Required**)
   * **minGap** ( number ) - define the minimum gap between the two date pickers. (**Required**)
   * **minDate** ( object ) - define the minimum date for the 'from' date picker. (**default: today**)
   * **startDate** ( object ) - define the date for the 'from' date picker. (**default: today**)
   * **endDate** ( object ) - define the date for the 'to' date picker. (**default: startDate+minGap**)

     example:
```
    <GapDatePickers name="datePicker" minGap={6} startDate={new Date(10.12.2016)} />
```

* #### Submit
A submit button, uses `this.context.form.submit()`

### Mixins
* #### input
A mixin for all form inputs that uses the api of it's containing form.

### Usage
```
var validations = {
      "email": "your email is invalid",
      "min:": "pass needs to be at lea"
};
<Form data={ data } onSubmit={ this.onFormSubmit } action="myModule.doStuff">
    <Input name="email" required="please fill out your email" validations={ validations }/>
    <Submit>Send</Submit>
</Form>
```