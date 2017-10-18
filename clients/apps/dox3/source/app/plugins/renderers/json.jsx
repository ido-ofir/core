
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'json',
    dependencies: [],
    get(){
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
        render(){
          // console.debug('this', source);
          
          
          var { source } = this.props;
          console.debug('object', source);
          
          if(!source) return null;
          
          return (
            <div>
              <pre>{ JSON.stringify(source, null, 4) }</pre>
            </div>
          );
        }
      };
    }
};
