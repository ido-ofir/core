var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
import {DropdownButton} from 'react-bootstrap';
core.Component('Button.Option', ['webint.mixin'], (mixin) => { // TODO: change the icon according to design
  return {
    mixins: [mixin],

    propTypes: {
      onOption: PropTypes.func,
      onColor: PropTypes.string,  // when hovered
      offColor: PropTypes.string,
      position: PropTypes.string // "up" || "right"
    },

    getInitialState() {
      return {hover: false}
    },

    onMouseOver() {
      this.setState({hover: true});
    },

    onMouseOut() {
      this.setState({hover: false});
    },

    render() {
      var button = {
        width: 30,
        height: 30,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: (this.state.hover)
          ? this.props.onColor || this.theme('colors.primary')
          : this.props.offColor || this.theme('inactive.primary'),
        ...this.props.style
      }
      if (this.props.position === "up") {
        return (

          <DropdownButton className="fa fa-ellipsis-v" style={ button }
            title=""
            onMouseOver={ this.onMouseOver }
            onMouseOut={ this.onMouseOut }
            onSelect={ this.props.onOption }
            pullRight dropup
            noCaret id='popup-style'>
            { this.props.children }
          </DropdownButton>

        )
      } else {
        return (

          <DropdownButton className="fa fa-ellipsis-v" style={ button }
            title=""
            onMouseOver={ this.onMouseOver }
            onMouseOut={ this.onMouseOut }
            onSelect={ this.props.onOption }
            pullRight noCaret id='popup-style'>
            { this.props.children }
          </DropdownButton>

        )
      }

    }
  }
});
