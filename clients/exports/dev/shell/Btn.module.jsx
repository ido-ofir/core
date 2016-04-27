
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
var styles = {
  btn: {
    minWidth: 26,
    minHeight: 26,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ddd',
    borderRadius: '50%',
    cursor: 'pointer',
    margin: '4px',
    color: '#fff',
    transition: '0.4s ease',
    WebkitTransition: '0.4s ease',
    position: 'relative'
  }
}

core.Component('shell.Btn', {
  propTypes: {
    color: PropTypes.string,
    onClick: PropTypes.func
  },
  render: function() {
    var style = { ...styles.btn, ...this.props.style };
    if(this.props.isOn) style.background = this.props.color;
    return (
      <div style={ style } onClick={ this.props.onClick }>
        { this.props.children }
      </div>
    );
  }

});
