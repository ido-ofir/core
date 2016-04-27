var React, { PropTypes } = require('react');
var validationMethods = require('../validationMethods');

module.exports = {
    contextTypes: {
      form: PropTypes.object
    },
    propTypes: {
      name: PropTypes.string.isRequired,
      required: PropTypes.string,
      validations: PropTypes.object
    },
    getInitialState () {
        var value = this.context.form.getInputValue(this.props.name);
        return {
            initialValue: value,
            lastValue: value,
            isPristine: true,
            isValid: true,
            error: null,
            feedback: '' // get success, warning or error
        };
    },
    componentWillMount(){
      this.context.form.addInput(this);
    },
    componentWillUnmount(){
      this.context.form.removeInput(this);
    },
    componentWillReceiveProps(props){
      if(props.name !== this.props.name){
        this.context.form.removeInput(this);
        setTimeout(()=> {
          this.context.form.addInput(this);
        }, 10);
      }

    },

    handleOnFocus(){
      setTimeout(()=>{
        if (this.validate(true) && this.props.required) this.setState({feedback:'success'});
        else if (!this.validate(true)) {
          this.setState({feedback:'error'});
        }
      }, 0);
    },

    handleOnBlur(){
     if (this.validate(false))
      this.setState({feedback:''})
    },

    validate: function(silent){
        if(this.isValid) return this.isValid();
        var required = this.props.required,
            value = this.context.form.getInputValue(this.props.name),
            validations = this.props.validations,
            isEmpty = (!value),
            args, name, valid;
        if(required && isEmpty){       // if a field is required and it is empty validation fails, and state.error will be the value of the required attribute of the input component.
            if(!silent){
              this.setState({
                  error: required,
                  isValid: false
              });
            }
            return false;
        }

          for(var nameWithArgs in validations){    // test all validations in props until one fails.
              args = nameWithArgs.split(':');
              name = args.shift();
              if(validationMethods[name]){
                  args.unshift(value);
                  valid = validationMethods[name].apply(null, args);    // call this validation method with arguments. note that the value is the first argument
                  if(!valid){
                    if(!silent){
                      this.setState({                         // if a validation failed, state.error will be the value of the failed validation in the validations attribute of the input component
                          error: validations[nameWithArgs],
                          isValid: false
                      });
                    }
                    return false;
                  }
              }
              else console.warn('validation ' + name + ' is not defined');
          }

          this.setState({
            isValid: true,
            error: null
          });

        return true;
    },
    invalidate(err){
        this.setState({                         // if a validation failed, state.error will be the value of the failed validation in the validations attribute of the input component
            error: err,
            isValid: false
        });
    }
};
