
var React = require('react');

var core = require('core');
var View = require('./View.jsx');

module.exports = React.createClass({
    mixins: [core.mixins.app],
    app: {
      domain: 'http://localhost',
      port: 4000
    },
    getInitialState(){
      return {
        views: {}
      };
    },
    componentDidMount(){
      this.connection.action('shell.views.getViews', (views)=>{
        this.setState({
          views: views
        });
      });
    },
    renderView(view, index){
      if(view.key === 'index') return;
      return (
        <View key={ index } view={ view } path={ `/${view.key}`}/>
      );
    },
    renderViews(views){
      var array = Object.keys(views).map((v)=>{ return {key: v, value: views[v]} });
      return array.map(this.renderView);
    },
    render () {
        return (
          <div style={ {padding: 30} }>
            <h2>Koko</h2>
            <ul>
            { this.renderViews(this.state.views) }
            </ul>
          </div>
        );
    }
});
