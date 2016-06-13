var React = require('react');
var core = require('core');
var PropTypes = React.PropTypes;

core.Component('shell.Open', ['shell.Btn'], (Btn)=>{
  return {
    contextTypes: {
      shell: PropTypes.object
    },
    getInitialState(){
      return {
        isOpen: (false)
      };
    },
    openEditor(){
      this.context.shell.connection.action('shell.editor.open', { path: location.href });
    },
    openTerminal(){
      this.context.shell.connection.action('shell.terminal.open', { path: location.href });
    },
    getOptions(){
      return {
        'Editor': this.openEditor,
        'Terminal': this.openTerminal
      };
    },
    render: function() {
      return (
        <Btn onClick={ this.openEditor }>E</Btn>
      );
    }
  };
});
