var React = require('react');

var core = require('core');

var PropTypes = React.PropTypes;

var style = {
  fontWeight: 'bold',
  cursor: 'pointer',
  color: '#3856B1'
};

core.Component('View', {
  getInitialState(){
    return {
      isOpen: false
    };
  },
  toggle(){
    this.setState({isOpen: !this.state.isOpen});
  },
  renderView(view, index){
    if(view.key === 'index') return;
    return (
      <core.components.View key={ index } view={ view } path={ `${this.props.path}/${view.key}`}/>
    );
  },
  renderApps(apps){
    var array = Object.keys(apps).map((v)=>{ return {key: v, value: apps[v]} });
    return array.map(this.renderView);
  },
  renderContent(apps){
    if(!this.state.isOpen) return null;
  return this.renderApps(apps);
  },
  render: function() {
    var view = this.props.view;
    if(!view.value) return (
      <li>
        <a href={ this.props.path }>{ view.key }</a>
      </li>
    );
    return (
      <li>
        <span style={ style } onClick={ this.toggle }>{ view.key }</span>
        <ul>
          { this.renderContent(view.value) }
        </ul>
      </li>
    );
  }
});
