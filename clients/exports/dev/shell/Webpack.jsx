var React = require('react');
var PropTypes = React.PropTypes;
var colors = {
  off: '#ddd',
  waiting: '#FFF76B',
  ok: '#30D230',
  error: 'red'
};
var textColors = {
  off: '#fff',
  waiting: 'grey',
  ok: '#fff',
  error: '#fff'
};
var Webpack = React.createClass({
  propTypes: {
    onError: PropTypes.func
  },
  contextTypes: {
    shell: PropTypes.object
  },
  getInitialState(){
    return {
      status: 'off',
    };
  },
  componentDidMount(){
    var connection = this.context.shell.connection;
    connection.action('shell.webpack.isProcessActive', { view: location.href }, this.isProcessActive);
    connection.on('webpackOutput', this.onWebpackOutput);
    window.onbeforeunload = ()=>{
      // if(this.state.status !== 'off') return 'Webpack is still running, should you close it?';
    };
  },
  componentWillUnmount(){
    var connection = this.context.shell.connection;
    connection.off('webpackOutput', this.onWebpackOutput);
  },
  isProcessActive(isActive){
    var status = this.state.status;
    if(isActive) {
      if(isActive.error){
        status = 'error';
        this.props.onError(isActive.error);
      }
      else{
        status = 'ok';
        this.props.onOk();
      }
    }
    else status = 'off';
    if(status !== this.state.status){
      this.setState({
        status: status
      });
    }
  },
  onWebpackOutput(str){
    var status = this.state.status;
    var error = false;
    if(str.indexOf('ERROR') > -1) {
      status = 'error';
      error = true;
    }
    else if(str.indexOf('Hash:') > -1) status = 'ok';
    if(status !== this.state.status){
      this.setState({
        status: status
      });
    }
    if(error){
      this.props.onError(str);
    }
    else if(status === 'ok'){
      this.props.onOk(str);
    }
  },
  onClick(){
    var connection = this.context.shell.connection;
    if(this.state.status === 'off'){
      connection.action('shell.webpack.startProcess', { view: location.href });
      this.setState({
        status: 'waiting'
      });
    }
    else if(this.state.status === 'ok' || this.state.status === 'error'){
      connection.action('shell.webpack.stopProcess', { view: location.href });
      this.setState({
        status: 'off'
      });
    }
  },
  render: function() {
    var status = this.state.status;
    var style = { ...this.props.style, background: colors[status], color: textColors[status] };
    return (
      <div style={ style } onClick={ this.onClick }>
        { this.props.children }
      </div>
    );
  }

});

module.exports = Webpack;
