var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');

var styles = {
  part: {
    border: '1px solid #ddd'
  }
};

var defaultProps = {
  Breadcrumbs: {},
  SquareImageWithIcon: {
    imgSrc: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRPUDFGlpy_spCl2NG1Xuaj8ctro1i1PDyQ5XrHBCHNzQJzm8_vSzSjOVf_sg',
    icon: 'fa fa-twitter',
    showIcon: true,
    color: 'blue',
    showColor: true,
    style: {position: 'relative'}
  }
};

const Cell = props =>
  <div style={{ padding: '2px', background: (props.active ? '#ff0' : 'none') }} onClick={ props.select }>
    <div style={{ height: 20, background: props.background }}></div>
  </div>

const ButtonSample = props =>
  <div style={{ padding: '2px', background: (props.active ? '#ff0' : 'none') }} onClick={ props.select }>
    <div style={{ height: 20, background: props.background }}></div>
  </div>

core.Component('Palletes', ['ui.Table'], (Table)=>{
  return {
    bindings: {
      palletes: ['core', 'theme', 'palletes']
    },
    getInitialState(){
      return {
        targetPalleteName: null,
        targetItemName: null
      };
    },
    selectTarget(palleteName, itemName){
      this.setState({
        targetPalleteName: palleteName,
        targetItemName: itemName
      });
    },
    setValue(color){
      this.props.onSelect(color);
    },
    render(){
      var palletes = this.state.palletes;
      return (
        <div>
          <Table style={{ textAlign: 'center' }}
                 columns={[{
              "title": "normal",
            },{
              "title": "hover",
            },{
              "title": "active",
            },{
              "title": "disabled",
            }]} rows={ palletes && palletes.map((pallete)=>{
              return {
                name: pallete.name,
                cells: [
                  <Cell background={ pallete.pallete.normal }
                        active={ (this.state.targetPalleteName === pallete.name) && (this.state.targetItemName === 'normal') }
                        select={ e => this.selectTarget(pallete.name, 'normal') }/>,
                  <Cell background={ pallete.pallete.hover }
                        active={ (this.state.targetPalleteName === pallete.name) && (this.state.targetItemName === 'hover') }
                        select={ e => this.selectTarget(pallete.name, 'hover') }/>,
                  <Cell background={ pallete.pallete.active }
                        active={ (this.state.targetPalleteName === pallete.name) && (this.state.targetItemName === 'active') }
                        select={ e => this.selectTarget(pallete.name, 'active') }/>,
                  <Cell background={ pallete.pallete.disabled }
                        active={ (this.state.targetPalleteName === pallete.name) && (this.state.targetItemName === 'disabled') }
                        select={ e => this.selectTarget(pallete.name, 'disabled') }/>
                ]
              };
            }) }/>
        </div>
      );
    }
  }
})



module.exports = core.Component('Parts', [
  'shell.Config',
  'ui',
  'ui.Button',
  'Parts.Ui',
  'divide.Horizontal',
  'divide.Vertical',
  'shell.Debug',
  'Palletes'
], (Config, ui, Button, Ui, Horizontal, Vertical, Debug, Palletes)=>{

  return {
    bindings: {
      theme: ['core', 'theme']
    },
    // componentDidMount(){
    //   core.connection.action('app.config', {}, (config)=>{
    //     this.context.app.set('core.app.config', config);
    //   });
    // },
    renderPart(name, part){
      return (
        <div key={ name }>
          <div>{ name }</div>
          <div>{ part.description }</div>
          <div style={ styles.part }>
            { React.createElement(part.component, part.props || {}) }
          </div>
        </div>
      );
    },
    render(){
      var children = [];
      // for(var m in parts){
      //   children.push(this.renderPart(m, parts[m]))
      // }
      return (
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto', padding: 40}}>
          <div>
              <Vertical width="360px" from="right">
                <Ui/>
                <Palletes/>
                <Config/>
              </Vertical>
          </div>
        </div>
      );
    }
  };
});
