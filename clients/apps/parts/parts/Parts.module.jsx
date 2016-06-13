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



module.exports = core.Component('Parts', [
  'shell.Config',
  'ui',
  'ui.Button',
  'Parts.Ui',
  'divide.Horizontal',
  'divide.Vertical',
  'shell.Debug'
], (Config, ui, Button, Ui, Horizontal, Vertical, Debug)=>{

  return {
    contextTypes: {
      app: React.PropTypes.object
    },
    componentDidMount(){
      this.context.app.connection.action('app.config', {}, (config)=>{
        this.context.app.set('core.app.config', config);
      });
    },
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
                <Config/>
              </Vertical>
          </div>
        </div>
      );
    }
  };
});
