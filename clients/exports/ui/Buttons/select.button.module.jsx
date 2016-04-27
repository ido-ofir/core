var React = require('react');
var PropTypes = React.PropTypes;
import {DropdownButton} from 'react-bootstrap';
var core = require('core');

var optStyle = {
  selected: {
    marginLeft:5
  },
  list:{
    backgroundColor: 'white',
    width: 60,
    borderRadius: 3,
    boxShadow: '0 2px 6px 0 rgba(0,0,0,0.3)',
    opacity:'0.8',
    display:'flex',
    flexDirection:'column',
    marginLeft:50,
    paddingLeft:5,
    position:'absolute'
  }
};
var toggle = {
  hide: {opacity:'0'},
  show: {opacity:'1'},
}
core.Component('Select.Button', ['webint.mixin','layout'], (mixin,layout) => { // TODO: change the icon according to design
  return {
    mixins: [mixin],
    propTypes: {
      onSelect: PropTypes.func,
      label: PropTypes.string
    },
    getInitialState() {
      return {hover: false, hide:false}
    },

    onMouseOver() {
      this.setState({hover: true});
    },

    onMouseOut() {
      this.setState({hover: false});
    },
    toggleOptions(){
      this.setState({hide : !this.state.hide});
    },
    render() {
      var button = {
        ...layout.flexAlignHor,
        ...layout.flexAlignVert,

        cursor:'pointer',
        textTransform:'uppercase',
        width: '140px',
        height: '40px',
        border: `1px solid ${this.theme('colors.border')}`,
        borderRadius: '4px',
        backgroundColor: this.theme('colors.default'),
        color: this.props.textColor,

      }

      var selected = {
        ...optStyle.selected
      };
      return (

        <div className="header-select" onClick={ this.toggleOptions } >
          { this.props.label }

          <span className="selected" style={ { ...button, ...selected} }>{ this.state.selected }</span>

          <div  className="options" style={ this.state.hide ? toggle.hide : toggle.show }>
            { this.props.children }
          </div>
          <span className="fa fa-arrow"></span>
        </div>

      )
    }
  }
});
