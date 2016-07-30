var React = require('react');
var pt = React.PropTypes;
var core = require('core');

core.Component('ui.Select', ['ui.Card', 'ui.Icon', 'ui.ListItem'], (Card, Icon, ListItem)=>{
  return {
    propTypes: {
      options: pt.array,
      onSelect: pt.func,
      selected: pt.any,
      listStyle: pt.object,
      itemStyle: pt.object
    },
    getInitialState(){
      return {
        isOpen: false
      };
    },
    events: {
      bodyClick(e, id){
        if(id !== this.clickId){
          this.setState({ isOpen: false });
        }
      },
      escKey(){
        this.setState({ isOpen: false });
      }
    },
    toggle(e){
      e.stopPropagation();
      this.clickId = core.utils.uuid();
      core.emit('bodyClick', e, this.clickId);
      this.setState({ isOpen: !this.state.isOpen })
    },
    onSelect(option){
      if(this.props.onSelect){
        this.props.onSelect(option);
      }
    },
    renderOptions(){
      return this.props.options.map((option, i)=>{
        var isSelected = (this.props.selected === option);
        return (<ListItem key={ i } onClick={ e => this.onSelect(option) } selected={ isSelected }>{ option }</ListItem>)
      })
    },
    render: function() {
      var children = this.props.children;
      if(core.isFunction(children)){
        children = children(this);
      }
      return (
        <div { ...this.props } style={{ position: 'relative', ...this.props.style }} onClick={ this.toggle }>
          { children }
          {
            core.createElement(Card, {
              "if": this.state.isOpen,
              style: { position: 'absolute', top: 40, right: 10, padding: '10px 0', minWidth: 120, zIndex: 1, ...this.props.listStyle }
            }, this.renderOptions())
          }
        </div>
      );
    }
  };
});
