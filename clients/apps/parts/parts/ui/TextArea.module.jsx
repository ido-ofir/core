
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

core.Component('Parts.TextArea', ['ui.TextArea'], (TextArea)=>{



  return {
    getInitialState(){
      return { value: '' };
    },
    render(){

      return (
        <div>
          <h3>ui.TextArea</h3>
            <ul>
              <li><b>value</b> - the value of the textarea</li>
              <li><b>onChange</b> - change handler, will recieve </li>
              <li><b>name</b> - a name identifier for the textarea</li>
            </ul>
            <pre style={{ display: 'flex' }}>
              { `<TextArea value={ this.state.value } onChange={ e => this.setState({ value: e.target.value }) }/>` }
            </pre>
            <TextArea value={ this.state.value } onChange={ e => this.setState({ value: e.target.value }) } style={{ minHeight: 100 }}/>
        </div>
      );
    }
  };
});
