
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

core.Component('No.Results', ['webint.mixin','layout'], (mixin, layout) => {

  return {

    render(){
      let flex = {
        ...layout.flexCol,
        ...layout.flexAlignVert,
        ...this.props.style
      }
      var text = this.props.children || 'No results'; 
      return (
        <div style={ flex }>
          <img src="/resources/images/Not_Enough_Data_Icon.png" width="150"/>
          <span style={{color:'#ccc', fontSize:28, padding:20}}>{ text }</span>
        </div>

      );
    }
  }
});
