
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

core.Component('Parts.Input', ['ui.Input'], (Input)=>{



  return {
    getInitialState(){
      return { value: '' };
    },
    render(){

      return (
        <div>
          <h3>ui.Input</h3>
            <ul>
              <li><b>value</b> - the value of the input</li>
              <li><b>onChange</b> - change handler, will recieve </li>
              <li><b>name</b> - a name identifier for the input</li>
            </ul>
            <pre style={{ display: 'flex' }}>
              { `<Input value={ this.state.value } onChange={ e => this.setState({ value: e.target.value }) }/>` }
            </pre>
            <Input value={ this.state.value } onChange={ e => this.setState({ value: e.target.value }) }/>
        </div>
      );
    }
  };
});
