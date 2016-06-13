var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/theme/terminal';
require('brace/mode/json');


core.Component('mongo.Editor', {
  componentDidMount(){
    window.editor = this.refs.editor;
  },
  render: function() {
    // console.log('render');
    return (
      <AceEditor mode="json"
        theme="terminal"
        name="UNIQUE_ID_OF_DIV"
        width="100%"
        height="100%"
        ref="editor"
        editorProps={{$blockScrolling: Infinity}}
        { ...this.props }/>
    );
  }
});
