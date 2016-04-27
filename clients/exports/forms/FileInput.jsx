var React = require('react');
var PropTypes = React.PropTypes;
var inputMixin = require('./mixins/input.jsx');

var inputStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  bottom: 0,
  cursor: 'pointer',
  opacity: 0
};

var FileInput = React.createClass({
    mixins: [inputMixin],
    handleChange (e) {
        var file = e.target.files && e.target.files[0];
        if(file){
            this.context.form.setInputValue(this.props.name, file);
            if(typeof this.props.callback === "function")
              this.props.callback(file);
        }
    },
    render () {
        return (
            <div style={ {position: 'relative', cursor: 'pointer', padding: 0} }>
                 { this.props.children }
                <input type="file" onChange={ this.handleChange } accept={this.props.accept} style={ inputStyle }/>
            </div>
        );
    }
});

module.exports = FileInput;
