var React = require('react');

var core = require('core');

var PropTypes = React.PropTypes;
var style = {
  fontWeight: 'bold',
  cursor: 'pointer',
  color: '#3856B1'
};
var View = React.createClass({
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
      <View key={ index } view={ view } path={ `${this.props.path}/${view.key}`}/>
    );
  },
  renderViews(views){
    var array = Object.keys(views).map((v)=>{ return {key: v, value: views[v]} });
    return array.map(this.renderView);
  },
  renderContent(views){
    if(!this.state.isOpen) return null;
    return this.renderViews(views);
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

module.exports = View;
