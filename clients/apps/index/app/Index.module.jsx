
var React = require('react');

var core = require('core');

core.Component('Index', ['core.App', 'View'], (App, View)=>{
  return {
      getInitialState(){
        return {
          apps: {}
        };
      },
      componentDidMount(){
        core.connection.action('shell.apps.getApps', (apps)=>{
          this.setState({
            apps: apps
          });
        });
      },
      renderView(view, index){
        if(view.key === 'index') return;
        return (
          <View key={ index } view={ view } path={ `/${view.key}`}/>
        );
      },
      renderApps(apps){
        var array = Object.keys(apps).map((v)=>{ return {key: v, value: apps[v]} });
        return array.map(this.renderView);
      },
      render () {
          return (
            <App style={ {padding: 30} }>
              <h2>Koko</h2>
              <ul>
              { this.renderApps(this.state.apps) }
              </ul>
            </App>
          );
      }
  }
});
