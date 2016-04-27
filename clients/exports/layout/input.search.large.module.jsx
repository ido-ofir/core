
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
var Radium = require('radium');
core.Component('SearchInput.Large', ['webint.mixin','layout'], (mixin, layout) => {

  return {
    mixins:[mixin],
    propTypes: {
      onChange: PropTypes.func,
      background: PropTypes.string,
      placholder: PropTypes.string
    },

    getDefaultProps(){
      return {
        background: '#ffffff'
      }
    },

    render() {
      var wrap = {
        position: 'relative',
        boxSizing: 'border-box',
        borderRadius: '4px',
        border: '1px solid #f0f5f8',
        backgroundColor: this.props.background,
        width: '300px',
        padding: '0 5px',
        height: '30px',
        ...layout.flexRow,
        ...layout.spaceBetween,
        ...layout.flexAlignVert,
        ...this.props.style
      }
      var input = {
        height:'100%',
        width:'100%',
        border: 0,
        outline: 0
      };

      return (
        <div style={wrap}>
          <input placeholder={ this.props.placeholder } style={ input } onChange={ this.props.onChange } />
          <i className="fa fa-search" style={ {color: this.theme('inactive.primary')} }></i>
        </div>

      )
    }
  }
});
