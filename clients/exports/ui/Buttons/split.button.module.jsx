var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
require('./bs.split.buttons.override.css');
import { MenuItem, SplitButton} from 'react-bootstrap';
var _ = require('lodash');
core.Component('Split.Button', ['webint.mixin'], (mixin) => { // TODO: change the icon according to design

  return {
    mixins:[mixin],
    propTypes: {
      onClick: PropTypes.func,
      options: PropTypes.array,
      theme: PropTypes.string,
      title: PropTypes.string
    },
    getDefaultProps(){
      return {
        title:'',
        theme:'primary'
      }
    },

    renderDropDown(e, key) {
      return <MenuItem key={key} onClick={e.func}>{e.name}</MenuItem>
    },
    render() {
      var button = {

      };

      return (
        <SplitButton key={0} className={this.props.theme}
          title={this.props.title}
          pullRight id={`split-button-basic-${this.props.theme}`}
          onClick={ this.props.onClick }>
          {_.map(this.props.options, this.renderDropDown)}
        </SplitButton>
      )
    }
  }
});
