var React = require('react');
var PropTypes = React.PropTypes;

var Tests = React.createClass({
  getInitialState(){
    var run = localStorage.getItem('shell.tests.run') === 'true';
    return {
      count: 0,
      run: run
    };
  },
  run(){
    this.refs.mocha.innerHTML = '';
    // console.log('running..');
    window.mocha.run();
  },
  componentDidMount() {
    if(this.state.run) this.run();
  },
  setRun(){
    var run = !this.state.run;
    if(run) this.run();
    this.setState({
      run: run
    });
    localStorage.setItem('shell.tests.run', run);
  },
  render: function() {
    return (
      <div>
        <div onClick={ this.setRun }>{ this.state.run ? '√' : ''} Run</div>
        <div id="mocha" ref="mocha"/>
      </div>
    );
  }

});

module.exports = Tests;
