
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'renderers.function',
    dependencies: [
      'Editor'
    ],
    get(Editor){
      return {
        propTypes: {
          app: 'object',
          source: 'object',
          onChange: 'func',
          id: 'any'
        },
        getInitialState(){
          
          var { source } = this.props;
          var keys = source ? Object.keys(source) : null;
          return {
            selectedKey: keys ? keys[0] : null
          };
        },
        onChildChange(child, index){
          var { source, onChange, id } = this.props;
          var newTarget = { ...source };
          if(newTarget.members[index] === child) return;
          newTarget.members = [ ...newTarget.members ];
          newTarget.members[index] = child;
          if(onChange) { onChange(newTarget, id); }
        },
        addChild(){
          var { app, source } = this.props;
          if(source.ofType){
            var type = app.types[source.ofType];
            if(type){
              
            }
          }
        },
        editChild(){},
        removeChild(){},
        onSave(code){
          var { items, onSave, type } = this.props;
          if(onSave){
            var item = items[this.state.selectedIndex];
            onSave({ code, item, type });
          }
        },
        render(){
          // console.debug('this', source);
          
          
          var { source } = this.props;
          
          if(!source) return null;
          
          return (
            <div style={{ flex: 1, height: 200 }}>
              <Editor code={ source.source || '' } onSave={ this.onSave } style={{ height: '100%' }}/>
            </div>
          );
        }
      };
    }
};
