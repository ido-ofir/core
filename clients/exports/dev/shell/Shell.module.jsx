
var React = require('react');
var PropTypes = React.PropTypes;

var core = require('core');
var Tests = require('./Tests.jsx');
var Webpack = require('./Webpack.jsx');
var styles = require('./styles.js');
var defaultMaxStackLength = 40;
var debugStack = [];

var lastFunctionCall = null;
var target = null;

function shouldMark(line){
  return ((line.indexOf('@') > -1) || (line.indexOf('>') > -1) || (line.indexOf('^') > -1) || (line.indexOf('ERROR') > -1) || (line.indexOf('Error:') > -1))
}

/*

config: {
  maxStackLength: 400
}


*/

core.Component('Shell', [
  'shell.Btn',
  'shell.ReadMe',
  'shell.Open',
  'shell.Debug',
  'shell.Modules',
  'shell.Config',
  'divide.Horizontal',
  'divide.Vertical'
], (Btn, ReadMe, Open, Debug, Modules, Config, Horizontal, Vertical)=>{

  return {
    propsTypes: {
      config: PropTypes.object.isRequired
    },
    childContextTypes: {
      shell: PropTypes.object
    },
    getChildContext(){
      return {
        shell: this
      };
    },
    getInitialState(){
      this.debugStack = [];
      // this.root.on('_debug', this._onDebug);

      var config = this.props.config || (this.props.host ? {domain: this.props.host, port: this.props.port} : {});
      this.connection = core.Connection(config);
      return {
        readMeIsOpen: (localStorage.getItem('shell.readMeIsOpen') === 'true'),
        testsIsOpen: (localStorage.getItem('shell.testsIsOpen') === 'true'),
        debugIsOpen: (localStorage.getItem('shell.debugIsOpen') === 'true'),
        readmeWidth: (localStorage.getItem('shell.readme.width')) || '25%',
        testsWidth: (localStorage.getItem('shell.tests.width')) || '25%',
        debugWidth: (localStorage.getItem('shell.debug.width')) || '25%',
        tab: 'Read me',
        docs: '',
        webpackError: false
      };
    },
    // debug(item){
    //   if(this.refs.debug) this.refs.debug.push(item);
    // },
    componentDidMount(){
      if(this.refs.debug) this.refs.debug.setStack(this.debugStack);
      this.connection.connect();
    },
    _onDebug(data){
      this.debugStack.unshift(data);
      var max = this.props.config.maxStackLength || defaultMaxStackLength;
      if(this.debugStack.length > max) this.debugStack.pop();
      lastFunctionCall = data;
    },
    openInEditor(){
      this.connection.action('shell.editor.open', { path: location.href });
    },
    toggle(field){
      var state = {};
      var item = state[field] = !this.state[field];
      localStorage.setItem(`shell.${field}`, item);
      this.setState(state);
    },
    toggleReadme(){
      this.toggle('readMeIsOpen');
    },
    toggleTests(){
      this.toggle('testsIsOpen');
    },
    toggleDebug(){
      this.toggle('debugIsOpen');
    },
    onWebpackOk(){
      this.setState({
        webpackError: false
      });
    },
    onWebpackError(err){
      var errorLine = false;
      var errorIndex = false;
      var error = err.split(/\n/).filter((line, i)=>{
        if(errorLine && (i < (errorIndex + 10))) return true;
        if(line.indexOf('ERROR') > -1){
          errorLine = line;
          errorIndex = i;
          return true;
        }
      });
      this.setState({
        webpackError: error
      });
      for (var i = 0; i < error.length; i++) {
        if(error[i].indexOf('ERROR') > -1){
          alert(error[i]);
          return;
        }
      }
    },
    renderWebpackErrorLine(line, i){
      var style = {};
      if(shouldMark(line)){
        style.color = '#fff';
      }
        return (
          <div style={ style } key={ i }>
            { line }
          </div>
        );
    },
    renderWebpackError(){
      var errorLines = this.state.webpackError;
      if(!errorLines || !errorLines.length) return null;
        return (
          <div style={ styles.webpackError }>
            { errorLines.map(this.renderWebpackErrorLine) }
          </div>
        );
    },
    renderReadmeWithContent(){
      if(!this.state.readMeIsOpen) return this.props.children;
      return (
        <Vertical width={ this.state.readmeWidth } from="right" ns="shell.readme">
          <div style={ styles.box }>
            { this.props.children }
          </div>
          <div style={ styles.box }>
            <ReadMe/>
          </div>
        </Vertical>
      );
    },
    renderVerticals(){
      if(!this.state.testsIsOpen) return this.renderReadmeWithContent();
      return (
        <Vertical width={ this.state.testsWidth } from="left" ns="shell.tests">
          <div style={ styles.box }>
            <Config/>
          </div>
          <div style={ styles.box }>
            { this.renderReadmeWithContent() }
          </div>
        </Vertical>
      );
    },
    renderContent(){
      if(!this.state.debugIsOpen) return this.renderVerticals();
      return (
        <Horizontal width={ this.state.debugHeight } from="bottom" ns="shell.debug">
          <div style={ styles.box }>
            <Modules/>
          </div>
          <div style={ styles.box }>
            { this.renderVerticals() }
          </div>
        </Horizontal>
      );
    },
    render: function() {
      var readMeBtn = { ...styles.btn };
      var testsBtn = { ...styles.btn };
      if(this.state.readMeIsOpen){
        readMeBtn.background = 'rgb(214, 143, 255)';
      }
      if(this.state.testsIsOpen){
        testsBtn.background = 'rgb(121, 175, 255)';
      }
      return (
        <div style={ styles.box }>
          { this.renderContent() }
          <div style={ styles.wrapper }>
            <Btn color="rgb(253, 200, 82)" onClick={ this.toggleDebug } isOn={ this.state.debugIsOpen }>D</Btn>
            <Btn color="rgb(121, 175, 255)" onClick={ this.toggleTests } isOn={ this.state.testsIsOpen }>T</Btn>
            <Open/>
            <Webpack style={ styles.btn } onOk={ this.onWebpackOk } onError={ this.onWebpackError }>W</Webpack>
            <Btn color="rgb(214, 143, 255)" onClick={ this.toggleReadme } isOn={ this.state.readMeIsOpen }>H</Btn>
          </div>
          { this.renderWebpackError() }
        </div>
      );
    }
  }
});
