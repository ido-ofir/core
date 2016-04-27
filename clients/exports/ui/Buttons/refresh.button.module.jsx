var React = require('react')
var PropTypes = React.PropTypes
import cx from 'classnames'
var core = require('core');

require('./refresh.button.module.scss')

core.Component('Button.Refresh', ['webint.mixin'], (mixin) => { // TODO: change the icon according to design
  return {
    mixins: [mixin],

    propTypes: {
      onRefresh: PropTypes.func
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
      const { onRefresh, refreshing } = this.props

      var button = {
        cursor: 'pointer',
        margin: '0 10px',
        color: (this.state.hover)
          ? this.theme('hovers.primary')
          : this.theme('inactive.primary')
      };

      return (
        <div
          className={ cx('button-refresh', { 'button-refresh-refreshing' : refreshing }) }
          onClick={onRefresh}
          style={button}
          onMouseOver={ this.onMouseOver }
          onMouseOut={ this.onMouseOut }>
          <i className="fa fa-refresh"></i>
        </div>

      )
    }
  }
});
