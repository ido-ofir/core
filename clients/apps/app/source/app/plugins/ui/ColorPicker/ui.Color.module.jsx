
var React = require('react');
var PropTypes = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');

require('./jscolor.js');

core.Component('ui.Color', [], ()=>{

  return {
      propTypes: {
        color: PropTypes.string,
        onFineChange: PropTypes.func,
        onChange: PropTypes.func
      },
      onFineChange(e){
        if(this.props.onFineChange) this.props.onFineChange(this.picker.toHEXString());
      },
      onChange(e){
        if(this.props.onChange) this.props.onChange(this.picker.toHEXString());
      },
      componentDidMount(){
        this.picker = new jscolor(ReactDom.findDOMNode(this), {
          valueElement: null,
          onFineChange: this.onFineChange,
          onChange: this.onChange
        });
        window.color = this;
        this.picker.fromString(this.props.color)
        // this.picker.valueElement = null;
      },
      render(){
        return (
          <button { ...this.props }>{ this.props.children }</button>
        )
      }
  };

});
