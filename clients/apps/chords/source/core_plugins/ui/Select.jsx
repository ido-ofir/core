
var React = require('react');
var pt = React.PropTypes;

var listItemStyle = {
  lineHeight: '30px',
  padding: '0 10px',
  background: '#fff',
  transition: '0.2s ease background',
  cursor: 'pointer',
  WebkitTransition: '0.2s ease background',
  ":hover": {
    background: '#ddd'
  }
};

module.exports = {
    name: 'Select',
    dependencies: ['ui.Card', 'ui.Icon', 'ui.ListItem'],
    get(Card, Icon, ListItem){
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
            componentDidMount(){
                core.on('click', this.bodyClicked)
            },
            componentWillUnmount(){
                core.off('click', this.bodyClicked);
            },
            bodyClicked(e, id){
                if(id !== this.clickId){
                    this.setState({ isOpen: false });
                }
                },
                toggle(e){
                e.stopPropagation();
                this.clickId = core.uuid();
                core.emit('click', e, this.clickId);
                this.setState({ isOpen: !this.state.isOpen })
            },
            onSelect(option){
                if(this.props.onSelect){
                    // console.log('on select');
                    this.props.onSelect(option);
                }
            },
            renderOptions(){
                return this.props.options.map((option, i)=>{
                    var isSelected = (this.props.selected === option);
                    return (<ListItem key={ i } onClick={ (e) => this.onSelect(option) } selected={ isSelected }>{ option }</ListItem>)
                })
            },
            render: function() {
                var children = this.props.children;
                if(children instanceof Function){
                    children = children(this);
                }
                console.debug('Card', Card);
                
                var { options, onSelect, selected, listStyle, itemStyle, ...props } = this.props;
                return (
                    <div { ...props } style={{ position: 'relative', ...this.props.style }} onClick={ this.toggle }>
                        { children }
                        {
                            this.state.isOpen ? core.createElement({
                                type: Card,
                                props: { style: { position: 'absolute', top: 40, right: 10, padding: '10px 0', minWidth: 120, zIndex: 1, ...this.props.listStyle } },
                                children: this.renderOptions()
                            })
                            : null
                        }
                    </div>
                );
            }
        };
    }
};
