var React = require('react');
var core = require('core');
var PropTypes = React.PropTypes;

core.Component('Module', {
  getInitialState(){
    return {
      isOpen: false
    };
  },
  toggle(){
    var dependents = core.getDependents(this.props.module.name);
    var dependencies = core.getDependencies(this.props.module.name);
    console.log('t');
    if(!this.state.isOpen){
      this.setState({
        isOpen: true,
        dependents: dependents,
        dependencies: dependencies
      });
    }
    else{
      this.setState({ isOpen: false })
    }
  },
  render(){
    var module = this.props.module;
    var state = this.state;
    return (
      <div onClick={ this.toggle }>
        <div style={{display: 'flex', borderBottom: '1px solid #ddd'}}>
          <div style={{ flex: 1}}>
            <div>{ module.name }</div>
          </div>
          <div style={{ flex: 1}}>{ module.path }</div>
        </div>
        {
          (function(){
            if(!state.isOpen) return null;
            console.log('ok');
            return (
              <div style={{ paddingBottom: '30px', borderBottom: '1px solid #ddd' }}>
                <h3>{ module.name }</h3>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <h4>{ state.dependencies.length } Dependencies</h4>
                  <div style={{ padding: '0 0 0 20px'}}>
                    <div>{ state.dependencies.map((item, i) => <div key={ i }> ➜ { item }</div>) }</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>{ state.dependents.length } Dependents</h4>
                  <div style={{ padding: '0 0 0 20px'}}>
                    <div>{ state.dependents.map((item, i) => <div key={ i }> ➜ { item }</div>) }</div>
                  </div>
                </div>
              </div>
              </div>
            );
          }())
        }

      </div>
    );
  }
});

core.Component('Modules', [
  'shell.Btn',
  'shell.Module'
], (Btn, Module)=>{
  return {
    contextTypes: {
      shell: PropTypes.object
    },
    getInitialState(){
      var contexts = core.getContexts();
      var modules = [];
      var path, context, name;
      for(context in contexts){
        for(name in contexts[context]){
          if(context === 'orphand'){
            path = contexts[context][name];
          }
          else{
            path = `${context}${contexts[context][name].substr(1)}`
          }
          modules.push({
            name: name,
            path: path
          });
        }
      }
      return {
        modules: modules,
        value: ''
      };
    },
    componentDidMount(){
      this.refs.input.focus();
    },
    renderModule(module){
      return (
        <Module key={ module.name } module={ module }/>
      );
    },
    filter(item){
      return item.name.toLowerCase().indexOf(this.state.value.toLowerCase()) > -1;
    },
    render() {

      var filtered = this.state.value ? this.state.modules.filter(this.filter) : this.state.modules;

      return (
        <div>
          <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: '40px', padding: '5px', borderBottom: '1px solid #ddd'}}>
            <input ref="input" value={ this.state.value } onChange={ (e)=>{ this.setState({ value: e.target.value }) } } style={{ width: '100%', outline: 0}}/>
          </div>
          <div style={{ position: 'absolute', top: '40px', right: 0, left: 0, bottom: 0, padding: '5px', overflow: 'auto'}}>
            { filtered.map(this.renderModule) }
          </div>
        </div>
      );
    }
  };
});
