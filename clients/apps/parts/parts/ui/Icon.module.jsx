
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

core.Component('Parts.Icon', ['ui.Icon'], (Icon)=>{



  return {
    propTypes: {
      match: PropTypes.string,
      include: PropTypes.string
    },
    bindings: {
      theme: 'core.config.theme'
    },
    getClassName(selectorText){
      var cls = selectorText.slice(1).split(':')[0]
      return this.props.include ? `${this.props.include} ${cls}` : cls;
    },
    getInitialState(){
      var styleSheets = document.styleSheets;
      var sheet, rules;
      for (var i = 0; i < styleSheets.length; i++) {
        if(styleSheets[i].href.match(this.props.match)){
          sheet = styleSheets[i];
          break;
        }
      }
      if(sheet){
        rules = [].filter.call(sheet.rules, (rule)=>{
          return rule.selectorText && (rule.selectorText.indexOf(':') > 1);
        }).map((rule)=>{
          return this.getClassName(rule.selectorText);
        });
      }
      return {
        rules: rules || [],
        seeAll: false
      };
    },
    renderRule(rule, i){

      return (
        <div key={ i } style={{
            flex: 1,
            minWidth: '20%',
            display:'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '90px',
            flexDirection: 'column' }}>
          <Icon className={ rule } size="30px"/>
          { rule }
        </div>
      )
    },
    render(){

      var rules = this.state.seeAll ? this.state.rules : this.state.rules.slice(0, 5);
      return (
        <div>
          <h3>ui.Icon</h3>
            <ul>
              <li><b>className</b> - normal css class of the icon</li>
              <li><b>onClick</b> - click handler</li>
              <li><b>onColor</b> - color of the icon when hovered - defaults to theme.colors.primary</li>
              <li><b>offColor</b> - color of the icon when not hovered - defaults to theme.inactive.primary</li>
              <li><b>activeColor</b> - color of the icon when clicked - defaults to theme.colors.secondary</li>
              <li><b>size</b> - short for css fontSize</li>
            </ul>
            <pre style={{ display: 'flex' }}>
              { `<Icon className="fa fa-glass" size="30px"/>` }
            </pre>
          <div style={{ display: 'flex', flexWrap: 'wrap'}}>
            { rules.map(this.renderRule) }
            <button onClick={()=>{ this.setState({seeAll: !this.state.seeAll }) }} style={{ background: '#fff', outline: 0, width: '100%', lineHeight: '30px', border: '1px solid #ddd' }}>
              { this.state.seeAll ? 'Fold' : 'See All Icons' }
            </button>
          </div>
        </div>
      );
    }
  };
});
