var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/theme/monokai';
import 'brace/theme/terminal';
import 'brace/ext/language_tools.js';
require('brace/mode/jsx');

var themes = `monokai github tomorrow kuroir twilight xcode textmate ambiance dawn merbivore_soft terminal`.split(' ');

module.exports = {
  name: 'Editor',
  get(){

    return {
      propTypes: {
        code: 'string',
        onChange: 'func',
        onSave: 'func'
      },
      getInitialState(){
        this.code = this.props.code || '';
        this.isFocused = false;
        return {
          id: `AceEditor-${ core.utils.uuid() }`,
          theme: 'monokai'
        };
      },
      componentDidMount(){
        this.editor = this.refs.editor;
        document.body.addEventListener('keydown', this.onKeyDown, true);
      },
      componentWillUnmount(){
        document.body.removeEventListener('keydown', this.onKeyDown, true);
      },
      componentWillReceiveProps(newProps){
        if(newProps.code !== this.props.code){
          this.code = newProps.code;
          this.forceUpdate();
        }
      },
      onChange(code){
        this.code = code;
        if(this.props.onChange){
          this.props.onChange(code);
        }
      },
      save(){
        if(this.props.onSave){
          this.props.onSave(this.code);
        }
      },
      onKeyDown(e){
        if(!this.isFocused) return;
        if(e.keyCode === 13){
          if(e.ctrlKey || e.altKey){
            this.save();
          }
        }
      },
      render: function() {
        // console.log('render');
        var { theme } = this.state;
        return (

            <AceEditor mode="jsx"
              theme={ theme }
              name={ this.state.id }
              width="100%"
              height="100%"
              ref="editor"
              style={{ flex: 1 }}
              value={ this.code }
              onChange={ this.onChange }
              editorProps={{$blockScrolling: Infinity}}
              onFocus={ e => this.isFocused = true }
              onBlur={ e => this.isFocused = false }
              { ...this.props }/>

        );
      }
    };

  }
}
