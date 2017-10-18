var React = require('react');
var PropTypes = React.PropTypes;

var cardStyle = {
  background: '#fff',
  border: '1px solid rgba(0,0,0,.15)',
  borderRadius: '3px',
  WebkitBoxShadow: '0 6px 12px rgba(0,0,0,.175)',
  boxShadow: '0 6px 12px rgba(0,0,0,.175)'
};

module.exports = {
    name: 'Card',
    get(){
        return {
            render() {
                return (
                    <div { ...this.props } style={{ ...cardStyle, ...this.props.style }}>
                      { this.props.children }
                    </div>
                );
            }
        }
    } 
};
