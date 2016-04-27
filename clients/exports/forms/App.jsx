var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');
var Shell = core.components.Shell;
var Component = require('./component/Component.jsx');
var ComponentDatePicker = require('./component/ComponentDatePicker.jsx');
var App = React.createClass({
    mixins: [core.mixins.app],
    app: {
      domain: 'localhost',
      port: 4000
    },
    getInitialState(){
      return {};
    },
    componentDidMount(){
      window.component = this.refs.component;
    },
    render () {
        return (
          <Shell>
            <ComponentDatePicker ref="component"/>
          </Shell>
        );
    }
});

ReactDom.render(<App/>, document.getElementById('app'));
