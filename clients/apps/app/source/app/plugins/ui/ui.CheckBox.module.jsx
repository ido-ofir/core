
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

var closeStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 20,
  cursor: 'pointer'
};
core.Component('ui.CheckBox', {
  propTypes: {
    onChange: PropTypes.func
  },
  onChange(e){
    this.props.onChange(e.target.checked);
  },
  render () {

    return (
      <input type="checkbox" { ...this.props } onChange={ this.onChange } style={{ alignItems: 'top'}}/>
    )
    console.debug("this.props", this.props);

    // return (
    //   <span onClick={ this.props.onClick } style={{
    //       display: 'inline-block',
    //       width: '20px',
    //       height: '20px',
    //       // background: '#eee',
    //       border: '2px solid #ddd',
    //       position: 'relative',
    //       cursor: 'pointer',
    //       alignItem: 'center',
    //       justifyContent: 'center',
    //       top: 0,
    //       borderRadius: '50%',
    //       color: core.theme('inactive.primary'),
    //       verticalAlign: 'middle',
    //       ...this.props.style }}>
    //     { this.props.checked ? (<span style={{
    //         position: 'absolute',
    //         top: '6px',
    //         left: '4px',
    //         fontSize: '8px',
    //         color: core.theme('colors.primary')
    //       }}>√</span>) : null }
    //   </span>
    // );
  }

});
