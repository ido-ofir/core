var React, { PropTypes } = require('react');

//  findOrCreate({a: {b: 7, c: 8}}, ['a', 'c'])  => 8    // returns a.c if it exists
//  findOrCreate({a: {b: 7}}, ['a', 'c'])  => {}   // if a.c didn't exist, now it's an empty object
function findOrCreate(target, array){
  if(!array.length) return target;
  var field = array.shift();
  if(!target[field]) target[field] = {};
  return findOrCreate(target[field], array);
}
function find(target, array){
  if(!target) return null;
  if(!array.length) return target || null;
  var field = array.shift();
  return find(target[field], array);
}

module.exports = {
    propTypes: {
      onSubmit: PropTypes.func,
      onChange: PropTypes.func,
      data: PropTypes.object,
      silent: PropTypes.bool,
      action: PropTypes.string
    },
    getDefaultProps(){
      return {
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
      this.inputs = {};
      var data = this.props.data || {};
      this.data = data;
      return {
          data: data,
          isValid: true,
          isPristine: true,
          isSilent: this.props.silent
      };
    },
    componentDidMount(){
      this.validate(true);
    },
    setData(data){
      this.data = data;
      this.setState({
        data: data
      });
      setTimeout(()=>{
        var valid;
        if (this.isMounted() && (!this.state.isSilent || !this.state.isPristine)) {
          valid = this.validate(this.state.isSilent);
          if(this.props.onChange) this.props.onChange(data, valid);
        }
      }, 0);
    },
    getInputValue(name){
      var value = find(this.data, name.split('.'));
      return value;
    },
    setInputValue(name, value){
      var array = name.split('.');
      var field = array.pop();
      var data = { ...this.state.data };
      var target = findOrCreate(data, array);
      target[field] = value;
      this.setData(data);
    },
    addInput(input) {
        var name = input.props.name;
        if(!name) return console.error(`form input requires a name property`);
        if(this.inputs[name]) return console.error(`there are two inputs named ${name}`);
        this.inputs[name] = input;
        this.validate(true);
    },
    removeInput(input) {
        var name = input.props.name;
        if(!this.inputs[name]) return console.error(`input ${name} tried to unregister but was not registered`);
        delete this.inputs[name];
        this.validate(true);
    },
    validate(silent){
        var inputs = this.inputs,
            formIsValid = true,
            inputIsValid;
            // console.log(this.state.isSilent);
        if (this.state.isSilent) { // to make the submit disable
          this.setState({
            isPristine: false,
          });
        }
        for(var name in inputs){
            inputIsValid = inputs[name].validate(silent);     //  validate the input.
            formIsValid = (inputIsValid && formIsValid);
        }
        this.setState({
            isValid: formIsValid
        });
        return formIsValid;
    },
    invalidate (response){
      var input;
      if(!response.data){
        alert('Unknown response');
        console.error('Unknown response:');
        return console.dir(response);
      }
      if(response.type !== 'reject'){
        return alert(response.data);
      }
      var rejects = response.data;
      for(var m in rejects){
        input = this.inputs[m];
        if(input){
            input.invalidate(rejects[m]);
        }
        else console.error('cannot find input called ' + m);
      }
    },
    submit () {
        var valid = this.validate(false);
        this.setState({
          isPristine: false,
          isSilent: false
        });
        var args = [this.state.data, ...arguments];
        if(valid && this.props.action) core.action(this.props.action, this.data);
        if(valid && this.props.onSubmit) this.props.onSubmit.apply(this, args);
        return valid ? 1 : 0;
    },
    reset(){
      this.setData({ ...this.props.data });
    },
    inputsCheckForOutSideUse(){
      var inputs = this.inputs;

      for(var name in inputs){
        var value = this.getInputValue(name);
        if (value)
          return(true);
      }
      return(false);
    }
};



///  customEvent polyfill
