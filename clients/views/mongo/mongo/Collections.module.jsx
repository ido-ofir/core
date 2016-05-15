var React = require('react');
var pr = React.PropTypes;
var core = require('core');

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/theme/terminal';
require('brace/mode/json');

var Input = require('./Input.jsx');
var initialData = { name: '' };

core.Component('mongo.Collections', [
  'ui.Icon',
  'ui.Button',
  'mongo.AddCollection',
  'mongo.Editor',
  'mongo.tree',
  'forms'
], (Icon, Button, AddCollection, Editor, tree, forms)=>{
  return {
    propTypes: {
      data: pr.object.isRequired
    },
    componentDidMount(){
      window.collections = this;
      this.docStringCursor = tree.select('docString');
      this.docStringCursor.on('update', this.setEditorValue);
      this.editor = window.edit = this.refs.editor.editor;
    },

    componentWillUnmount(){
      // this.docStringCursor.off('update', this.updateEditor);
    },
    getInitialState(){
      return {
        docString: ''
      };
    },
    setEditorValue(e){
      var value = e.data.currentData;
      this.updateEditor(value)
    },
    updateEditor(value){
      if(!value) value = '';
      this.setState({ docString: value});
    },
    saveDoc(){
      var selectedCollection = this.props.data.selectedCollection;
      var jsonString = this.state.docString;
      if(!selectedCollection) return;

      try{
        var json = JSON.parse(jsonString);
      }
      catch(err){ return console.error(err); }

      core.action('mongo.updateDocument', { collection: selectedCollection.name, document: json })
    },
    addCollection(){
      var data = { ...this.refs.addCollection.data };
      this.refs.addCollection.reset();
      core.action("mongo.addCollection", data.name);
    },
    removeCollection(name, e){
      e.stopPropagation();
      core.action("mongo.removeCollection", name);
    },
    addDocument(data){
      var jsonString = this.state.docString;
      var selectedCollection = this.props.data.selectedCollection;
      if(!selectedCollection) return;
      this.refs.addDocument.reset();
      core.action('mongo.createDocument', { collection: selectedCollection.name, document: data })
    },
    removeDocument(name, e){
      e.stopPropagation();
      core.action('mongo.removeDocument', name);
    },
    cloneDocument(data){
      var jsonString = this.state.docString;
      var selectedCollection = this.props.data.selectedCollection;
      if(!selectedCollection) return;
      try{
        var json = JSON.parse(jsonString);
        core.action('mongo.server.createDocument', { collection: selectedCollection.name, document: json })
      }
      catch(err){
        console.error(err);
      }
    },

    render(){
      var collections = this.props.data.collections;
      var selectedCollection = this.props.data.selectedCollection;
      var selectedDocument = this.props.data.selectedDocument;
      var items = selectedCollection ? selectedCollection.items : [];
      var collectionName = selectedCollection ? selectedCollection.name : '';
      return (
        <div style={{ display: 'flex', height: '100%', color: this.theme('colors.text') }}>

          <div style={{ minWidth: 250, borderRight: '1px solid #ddd' }}>
            <h4 style={{ padding: '0 6px', color: this.theme('hovers.text') }}>Collections</h4>
            <forms.Form ref="addCollection"
                        data={ initialData }
                        onSubmit={ this.addCollection }
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}>
                <Input name="name" placeholder="Name" inputStyle={{marginBottom: 0}} onEnterKey={ this.addCollection }/>

                <Icon className="fa fa-plus" size="20px" style={{ marginLeft: 15 }} onClick={ this.addCollection }/>

            </forms.Form>
            {
              //  names of collections with count.
              collections.map((collection, i)=>{
                var isSelected = (selectedCollection && (selectedCollection.name === collection.name));
                var color = isSelected ? this.theme('hovers.text') : this.theme('colors.text');
                return (
                  <div key={ i }
                      onClick={ (e)=>{
                        core.action('mongo.getCollection', collection.name);
                      }}
                      style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 5,
                      cursor: 'pointer',
                      color: color,
                      lineHeight: '30px',
                      background: isSelected ? this.theme('backgrounds.primary') : '#fff',
                      borderBottom: `1px solid ${isSelected ? this.theme('hovers.text') : this.theme('colors.border')}`}}>
                    <span>{ collection.name } ({ collection.count })</span>
                    <div style={{ display: 'flex' }}>
                      <Icon className="fa fa-remove" offColor={ color } onClick={ this.removeCollection.bind(this, collection.name) }/>
                    </div>
                  </div>
                );
              })
            }
          </div>
          <div style={{ minWidth: 250, borderRight: '1px solid #ddd' }}>
            <h4 style={{ padding: '0 6px', color: this.theme('hovers.text') }}>Documents</h4>
            <forms.Form ref="addDocument"
                        data={ { name: ''} }
                        onSubmit={ this.addDocument }
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}>
                <Input name="name" placeholder="Name" inputStyle={{marginBottom: 0}} onEnterKey={ ()=>{ this.refs.addDocument.submit() } }/>

                <Icon className="fa fa-plus" size="20px" style={{ marginLeft: 15 }} onClick={ ()=>{ this.refs.addDocument.submit() } }/>

            </forms.Form>
            {
              // documents of selected collection
              items.map((item, i) => {
                var key = item.name || item._id;
                var isSelected = (selectedDocument && (selectedDocument._id === item._id));
                var color = isSelected ? this.theme('hovers.text') : this.theme('colors.text');
                return (
                  <div key={ i }
                      onClick={ (e)=>{
                        core.action('mongo.getDocument', {
                          collection: collectionName,
                          id: item._id
                        })
                      }}
                      style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 5,
                      color: color,
                      cursor: 'pointer',
                      lineHeight: '30px',
                      background: isSelected ? this.theme('backgrounds.primary') : '#fff',
                        borderBottom: `1px solid ${isSelected ? this.theme('hovers.text') : this.theme('colors.border')}`}}>
                    <span>{ key }</span>
                    <div style={{ display: 'flex' }}>
                      <Icon className="fa fa-remove" offColor={ color } onClick={ this.removeDocument.bind(this, { collection: collectionName, id: item._id }) }/>
                    </div>
                  </div>
                );
              })
            }
          </div>
          <div style={{ flex: 1, position: 'relative', height: '100%'}}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 40}}>
              <AceEditor mode="json"
                theme="terminal"
                name="mongo-editor"
                width="100%"
                height="100%"
                ref="editor"
                value={ this.state.docString }
                onChange={ this.updateEditor }
                editorProps={{$blockScrolling: Infinity}}/>
            </div>
            <div style={{ position: 'absolute', height: 40, left: 0, right: 0, bottom: 0}}>
              <Button onClick={ this.saveDoc }>Save</Button>
            </div>
          </div>
        </div>
      );
    }
  };
});
