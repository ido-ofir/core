

var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/theme/terminal';
require('brace/mode/markdown');

core.Component('FileEditor.FileSystemItem', {
  contextTypes: {
    shell: React.PropTypes.object
  },
  getInitialState(){
    return {
      isOpen: false,
      children: []
    };
  },

  renderChild(child, i){
    return <core.components.FileSystemItem key={ i } item={ child } path={ [...this.props.path, child.name] }/>
  },
  toggle(e){
    e.stopPropagation();
    if(!this.state.isOpen){
      core.connection.action('fs.readdir', {path: this.props.path}, this.setChildren);
    }
    this.setState({ isOpen: !this.state.isOpen });
  },
  setChildren(children){
    this.setState({
      children: children
    });
  },
  openFile(){
    this.emit('openFile', this.props.item, this.props.path);
  },
  render: function() {
    var style = { paddingLeft: 16, cursor: 'pointer', position: 'relative', paddingLeft: 20 }
    if(this.props.item.type === 'file'){
      return (
        <div style={ style } onClick={ this.openFile }>{ this.props.item.name }</div>
      );
    }
    return (
      <div style={ style} onClick={ this.toggle }>
        <span style={{ position: 'absolute', top: 2, left: 2, fontSize: '12px'}}>{ (this.state.isOpen ? '▼' : '►' ) }</span>
        { this.props.item.name }
        { this.state.isOpen ? this.state.children.map(this.renderChild) : null }
      </div>
    );
  }
});

core.Component('FileEditor.FileSystem', ['FileEditor.FileSystemItem'], (FileSystemItem)=>{
  return {

    getInitialState(){
      return {
        items: []
      }
    },
    renderItem(item, i){
      return <FileSystemItem key={ i } item={ item } path={ [item.name] }/>
    },
    render: function() {
      // console.log('render');
      return (
        <div style={{ userSelect: 'none'}}>{ this.props.items.map(this.renderItem) }</div>
      );
    }
  };
});

core.Component('FileEditor', ['divide.Vertical', 'FileEditor.FileSystem'], (Editor, Vertical, FileSystem)=>{
  return {
    events: {
      'openFile': 'openFile'
    },
    getInitialState(){
      core.connection.action('fs.readdir', {path: []}, this.setItems);
      return {
        mode: 'javascript',
        items: [],
        file: ''
      };
    },
    setItems(data){
      var folders = [],
          files = [];
      data.map((item)=>{
        if(item.type === 'file') files.push(item);
        else folders.push(item);
      });
        this.setState({
          items: folders.concat(files)
        });
    },
    contextTypes: {
      shell: React.PropTypes.object
    },
    openFile(item, path){
      window.a = this.refs.editor;
      // return console.dir(item, path);
      core.connection.action('fs.readfile', {path: path}, this.setFile);
    },
    setFile(file){
      this.setState({
        file: file
      });
    },
    readDir(dir){

    },
    onCodeChange(v){
      console.log(v);
    },
    render: function() {
      // console.log('render');
      return (
        <Vertical>
        <FileSystem items={ this.state.items }/>
          <AceEditor
            mode={ this.state.mode }
            theme="terminal"
            onChange={this.onCodeChange}
            name="UNIQUE_ID_OF_DIV"
            width="100%"
            height="100%"
            ref="editor"
            value={ this.state.file }
            editorProps={{$blockScrolling: true}}
          />
        </Vertical>
      );
    }
  };
});
