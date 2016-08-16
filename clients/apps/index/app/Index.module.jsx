
var React = require('react');
var sa = require('superagent')
var core = require('core');

core.Component('Index', ['core.App', 'View'], (App, View)=>{
  return {
      getInitialState(){
        return {
          apps: {}
        };
      },
      componentDidMount(){
        sa.post('/actions/shell/apps/getApps', (err, res)=>{
          console.debug("apps", res.body);
          this.setState({
            apps: res.body.data
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
              <h2>Apps</h2>
              <ul>
              { this.renderApps(this.state.apps) }
              </ul>
            </App>
          );
      }
  }
});
