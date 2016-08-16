var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/theme/monokai';
import 'brace/theme/github';
import 'brace/theme/tomorrow';
import 'brace/theme/kuroir';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import 'brace/theme/textmate';
import 'brace/theme/ambiance';
import 'brace/theme/dawn';
import 'brace/theme/merbivore_soft';
import 'brace/theme/terminal';
import 'brace/ext/language_tools.js';
require('brace/mode/jsx');

var themes = `monokai github tomorrow kuroir twilight xcode textmate ambiance dawn merbivore_soft terminal`.split(' ');


core.Component('AceEditor', ['snippets', 'ui.Select', 'ui.Icon', 'ui.ListItem'], (snippets, Select, Icon, ListItem)=>{

  return {
    getInitialState(){
      return {
        id: `AceEditor-${ core.utils.uuid() }`
      };
    },
    bindings: {
      code: ['core', 'values', { name: 'code' }],
      theme: ['core', 'values', { name: 'theme' }]
    },
    componentDidMount(){
      this.editor = this.refs.editor;
    },
    render: function() {
      // console.log('render');
      var { code, theme } = this.state;
      return (

        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ width: 200, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, padding: 4 }}>
              {
                snippets.map((s, i)=>
                  <ListItem key={ i } onClick={ e => code.set(s.value) } selected={ code.value === s.value }>{ s.name }</ListItem>
                )
              }
            </div>

          </div>
          <AceEditor mode="jsx"
            theme={ theme.value }
            name={ this.state.id }
            width="100%"
            value={ code.value }
            height="100%"
            ref="editor"
            style={{ flex: 1 }}
            editorProps={{$blockScrolling: Infinity}}
            { ...this.props }/>
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
              {
                <Select options={ themes } selected={ theme.value } onSelect={ (v) => {
                   theme.set(v);
                   localStorage.setItem('theme', v);
                  }}>
                  {
                    (select) => <Icon className="fa fa-paint-brush" active={ select.state.isOpen }/>
                  }
                </Select>

              }
            </div>
        </div>

      );
    }
  };
});
