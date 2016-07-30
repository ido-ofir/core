var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/theme/terminal';
import 'brace/ext/language_tools.js';
require('brace/mode/json');

core.Component('AceEditor', {
  getInitialState(){
    return {
      id: `AceEditor-${ core.utils.uuid() }`
    };
  },
  componentDidMount(){
    this.editor = this.refs.editor;
  },
  render: function() {
    // console.log('render');
    return (
      <AceEditor mode="json"
        theme="terminal"
        name={ this.state.id }
        width="100%"
        height="100%"
        ref="editor"
        editorProps={{$blockScrolling: Infinity}}
        { ...this.props }/>
    );
  }
});
