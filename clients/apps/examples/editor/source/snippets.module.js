
var core = require('core');
var Select = `
<Select options={ ['one', 'two', 'three'] }>
  {
    (select) => <Icon className="fa fa-paint-brush" active={ select.state.isOpen }/>
  }
</Select>
`;

var Card = `
var React = require('react');
var core = require('core');

var cardStyle = {
  background: '#fff',
  border: '1px solid #ccc',
  border: '1px solid rgba(0,0,0,.15)',
  borderRadius: '3px',
  boxShadow: '0 6px 12px rgba(0,0,0,.175)'
};

core.Component('ui.Card', {
  render: function() {
    return (
      <div { ...this.props } style={{ ...cardStyle, ...this.props.style }}>
      { this.props.children }
      </div>
    );
  }
});
`;

core.Module('snippets', [{
  name: 'Select',
  value: Select
},{
  name: 'Card',
  value: Card
}]);
