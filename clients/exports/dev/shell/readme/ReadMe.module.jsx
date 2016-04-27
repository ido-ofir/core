var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

var marked = require('marked');
var styles = require('./styles.js');



core.Component('shell.ReadMe', [
  'divide.Horizontal',
  'divide.Vertical'
  // 'Editor'
], (Horizontal, Vertical)=>{
  return {
    contextTypes: {
      shell: PropTypes.object
    },
    getInitialState(){
      var edit = localStorage.getItem('shell.readme.edit');
      if(edit === 'false') edit = false;
      return {
        edit: edit,
        readme: {
          __html: ''
        },
        lastEdit: null
      };
    },
    componentDidMount(){
      this.context.shell.connection.action('shell.views.getReadMe', { view: location.href }, (readme)=>{
        this.setState({
          markdown: readme
        });
      });
    },
    toggleEdit(){
      var edit = !this.state.edit;
      localStorage.setItem('shell.readme.edit', edit);
      this.setState({
        edit: edit
      });
    },
    setValue(e){
      var value = e.target ? e.target.value : e;
      console.log('set');
      this.setState({
        markdown: value,
        lastEdit: new Date().getTime()
      });
      setTimeout(this.maybeSave, 2000)
    },
    maybeSave(){
      if(!this.state.lastEdit) return;
      var now = new Date().getTime();
      if(now - this.state.lastEdit > 1800) {
        if(this.isMounted()){
          this.setState({
            lastEdit: null
          });
        }
        this.save();
      }
    },
    save(){
      this.context.shell.connection.action('shell.views.setReadMe', {
        view: location.href,
        markdown: this.state.markdown
      });
    },
    renderContent(){
      var mark = this.state.markdown ? marked(this.state.markdown) : '';
      var html = {
        __html: mark
      };
      var result = (<div style={{ ...styles.box, padding: 20}} ref="viewer"  onWheel={ this.viewScroll } dangerouslySetInnerHTML={ html } ></div>);
      var editor = (<div>
        <textarea ref="editor" onWheel={ this.editScroll } style={ styles.textarea } value={ this.state.markdown } onChange={ this.setValue }></textarea>
        <a style={ styles.link } href="https://help.github.com/articles/markdown-basics/" target="_blank">markdown</a>
      </div>);

      // editor = <Editor value={ this.state.markdown }
      //   onChange={ this.setValue }
      //   mode="markdown"
      //   theme="terminal"
      //   name="UNIQUE_ID_OF_DIV"
      //   editorProps={{$blockScrolling: true}}/>

      if(!this.state.edit) return result;
      return (
        <Horizontal>
          { editor }
          { result }
        </Horizontal>
      );
    },
    editMouseMove(){

    },
    viewMouseMove(){
      view
    },
    editScroll(e){
      var precent = this.refs.editor.scrollTop / (this.refs.editor.scrollHeight - this.refs.editor.clientHeight);
      this.refs.viewer.scrollTop = (this.refs.viewer.scrollHeight - this.refs.viewer.clientHeight) * precent;
    },
    viewScroll(e){
      if(!this.refs.editor) return;
      var precent = this.refs.viewer.scrollTop / (this.refs.viewer.scrollHeight - this.refs.viewer.clientHeight);
      this.refs.editor.scrollTop = (this.refs.editor.scrollHeight - this.refs.editor.clientHeight) * precent;
    },
    split(){
      var split = this.state.split;
      if(!split) split = 'vertical';
      else if(split === 'vertical') split = 'horizontal';
      else split = false;
      this.setState({split: split});
    },
    splitContent(){
      return '_';
    },
    onScroll(){
      console.log('scroll');
    },
    render: function() {
      var editBtnStyle = { ...styles.btn };
      if(this.state.edit){
        editBtnStyle.background = '#4c4';
      }
      if(this.state.lastEdit){
        editBtnStyle.background = '#ee3';
      }
      return (
        <div style={ { ...styles.box, padding: '20px', overflow: 'auto' } }>
          <div style={ styles.wrapper }>
            <div style={ editBtnStyle } onClick={ this.toggleEdit }>E</div>

          </div>
          { this.renderContent() }
        </div>
      );
    }
  };
});
