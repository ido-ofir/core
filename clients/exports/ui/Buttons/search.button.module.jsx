var React = require('react');
var PropTypes = React.PropTypes;
import {OverlayTrigger, Popover} from 'react-bootstrap';
require('./bs.search.popup.override.css');
var core = require('core');
core.Component('Table.Button.Search', ['webint.mixin','SearchInput.Small'], (mixin, SearchInput) => {
  return {
    mixins: [mixin],
    propTypes: {
      onChange: PropTypes.func
    },
    getInitialState() {
      return {hover: false, showSearch: false}
    },

    onMouseOver() {
      this.setState({hover: true});
    },

    onMouseOut() {
      this.setState({hover: false});
    },
    toggleSearch(){
      this.setState({
        showSearch: !this.state.showSearch
      });
    },
    render() {
      var button = {
        margin: '0 10px',
        color: (this.state.hover)
          ? this.theme('hovers.primary')
          : this.theme('inactive.primary')
      }

      return (
        <OverlayTrigger onEntered={this.focus} onExited={this.blur}
          className="fa fa-search" trigger="click" rootClose
          style={ button }
          onMouseOver={ this.onMouseOver }
          onMouseOut={ this.onMouseOut }
          placement="bottom"
          overlay={
            <Popover id="search-input-override" style={ {padding: '5px'} }>
            <SearchInput onChange={this.props.onChange} onChangeDebounce={this.props.onChangeDebounce} placeholder={this.props.placeholder} value={this.props.value} style={ {border:0} }/>
          </Popover>}
          >

          <i className="fa fa-search" style={button}/>

        </OverlayTrigger>


      )
    }
  }
});
