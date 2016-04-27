
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
var Radium = require('radium');
var debounce = require('debounce');

core.Component('SearchInput.Small', ['webint.mixin','layout'], (mixin, layout) => {

  return {
    mixins:[mixin],
    enhancers: [Radium],
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

    componentDidMount() {
      this.debounceSearch = debounce((e) => {
        this.props.onChangeDebounce(e);
      }, 1000)
    },

    onChangeDebounce(e) {
      this.debounceSearch(e.target.value);
    },

    render() {
      var wrap = {
        position: 'relative',
        boxSizing: 'border-box',
        borderRadius: '4px',
        backgroundColor: this.props.background,
        width: '250px',
        padding: '0 5px',
        height: '30px',
        ...layout.flexRow,
        ...layout.spaceBetween,
        ...layout.flexAlignVert
      }
      var input = {
        height:'100%',
        width:'100%',
        borderRadius: '4px',
        border: `1px solid ${this.theme('colors.border')}`,
        ...this.props.style,
      };

      return (
        <div style={wrap}>
          <input placeholder={ this.props.placeholder } value={this.props.value} placeholder={this.props.placeholder} style={ input } onChange={ this.props.onChange || this.onChangeDebounce } />
        </div>

      )
    }
  }
});
