var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');
require('contexts/dev');
var Shell = core.components.Shell;
var Component = require('./Component');
var Koko = require('components/Koko');
require('./Component/test.js');
var config = {
  domain: 'localhost',
  port: 4000
};
var App = React.createClass({
    mixins: [core.mixins.app],
    app: config,
    getInitialState: function() {
      return {
        isOpen: (true)
      };
    },
    componentDidMount(){
      window.component = this.refs.component;
    },
    render () {
        return (
          <Koko config={ config }>
            <Shell config={ config }>
              <Component ref="component"/>
            </Shell>
          </Koko>
        );
    }
});

ReactDom.render(<App/>, document.getElementById('app'));
