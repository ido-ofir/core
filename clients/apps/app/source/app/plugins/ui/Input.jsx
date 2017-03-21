var React = require('react');
var pt = React.PropTypes;

var inputStyle = {
  display: 'block',
  width: '100%',
  lineHeight: 1.42857143,
  outline: 0,
  height: '34px',
  padding: '6px 12px',
  fontSize: '14px',
  color: '#555',
  backgroundColor: '#fff',
  backgroundImage: 'none',
  border: '1px solid #ccc',
  borderRadius: '4px',
  WebkitBoxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
  boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
  WebkitTransition: 'border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s',
  Otransition: 'border-color ease-in-out .15s,box-shadow ease-in-out .15s',
  transition: 'border-color ease-in-out .15s,box-shadow ease-in-out .15s'
};
var focusStyle = {
  border: '1px solid #66afe9',
  WebkitBoxShadow: 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)',
  // WebkitBoxShadow: 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,230,0,.6)',
  boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)'
};
var errorStyle = {
    position: 'absolute',
    fontSize: '10px',
    left: '6px',
    right: 0,
    bottom: '-14px',
    color: 'red',
    textAlign: 'left'
};

module.exports = {
  $_type: 'component',
  name: 'ui.Input',
  get(){
      return {
        propTypes: {
          name: pt.string,
          value: pt.string,
          onChange: pt.func,
          onChangeText: pt.func,
          onEnterKey: pt.func,
          type: pt.string,
          placeholder: pt.string
        },
        contextTypes: {
          form: pt.object
        },
        getInitialState() {
          return {
            focus : false
          }
        },
        onFocus(){
          this.setState({
            focus : true
          });
        },
        onBlur(){
          this.setState({
            focus : false
          });
        },
        onKeyUp(e){
            if(e.keyCode === 13 && this.props.onEnterKey) {
              this.props.onEnterKey(e.target.value);
            }
        },
        handleChange (e) {
            var value = e.target.value;
            if(this.context.form) this.context.form.set(this.props.name, value);
            if(this.props.onChange) this.props.onChange(e);
            if(this.props.onChangeText) this.props.onChangeText(e.target.value);
        },
        render() {
            var focus = this.state.focus ? focusStyle : {};
            var style = { ...inputStyle, ...focus, ...this.props.style };
            var value = this.props.value;

            return (
                      <input type={ this.props.type || "text" }
                            style={ style }
                            placeholder={this.props.placeholder}
                            value={ value }
                            onChange={this.handleChange}
                            onKeyUp={this.onKeyUp}
                            name={ this.props.name }
                            onFocus={ this.onFocus }
                            onBlur={ this.onBlur }/>
            );
        }
    };
  }
};
