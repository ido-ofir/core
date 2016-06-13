
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
    onClick: PropTypes.func
  },
  onClick(e){
    if(this.props.onClick) this.props.onClick(e.target.checked)
  },

  render () {

    return (
      <input type="checkbox" { ...this.props } onClick={ this.onClick } style={{ alignItems: 'top'}}/>
    )

    // return (
    //   <span onClick={ this.props.onClick } style={{
    //       display: 'inline-block',
    //       width: '14px',
    //       height: '14px',
    //       background: '#eee',
    //       border: '1px solid #ddd',
    //       position: 'relative',
    //       cursor: 'pointer',
    //       alignItem: 'center',
    //       justifyContent: 'center',
    //       top: 0,
    //       color: this.theme('inactive.primary'),
    //       verticalAlign: 'middle',
    //       ...this.props.style }}>
    //     { this.props.checked ? (<span className="glyphicon glyphicon-ok" style={{
    //         position: 'absolute',
    //         top: '6px',
    //         left: '4px',
    //         fontSize: '8px',
    //         color: this.theme('colors.primary')
    //       }}></span>) : null }
    //   </span>
    // );
  }

});
