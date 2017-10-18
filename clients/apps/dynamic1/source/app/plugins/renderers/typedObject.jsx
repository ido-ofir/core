
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'typedObject',
    dependencies: [
      'renderers.fields',
      'renderers.object',
    ],
    get(fields, object){

      var app = this;
      console.debug('app', app);
      

      return {
        propTypes: {
          map: 'object',
          source: 'object',
          onChange: 'func',
          path: 'array'
        },
        getInitialState(){
          
          var { source } = this.props;
          var keys = source ? Object.keys(source) : null;
          return {
            selectedKey: keys ? keys[0] : null
          };
        },
        // onChildChange(child, index){
        //   var { source, onChange, id } = this.props;
        //   var newTarget = { ...source };
        //   if(newTarget.members[index] === child) return;
        //   newTarget.members = [ ...newTarget.members ];
        //   newTarget.members[index] = child;
        //   if(onChange) { onChange(newTarget, id); }
        // },
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
        onChildChange(path, value){
          var isTypedArray = (this.props.source['$_type'] === 'array');
          var isTypedObject = (this.props.source['$_type'] === 'object');
          if(isTypedArray){
            path = [ ...path ];
            path.splice(1, 0, 'items');
          }
          else if(isTypedObject){
            path = [ ...path ];
            path.splice(1, 0, 'members');
          }
          if(this.props.onChange){
            this.props.onChange(path, value);
          }
        },
        render(){
          // console.debug('this', source);
          
          
          var { source, path, map, onChange } = this.props;
          
          if(!source) return null;
          var plugin = app.plugins.renderers;
          var $_type, name;
          var hasPrimitiveValues = false;
          var nextSource = {};
          var keys = Object.keys(source).filter((key)=>{
            // if(app.isPrimitive(source[key])){
            //   hasPrimitiveValues = true;
            // }
            if(key === '$_type'){
              $_type = source[key];
              return false;
            }
            else if(key === 'name'){
              name = source[key];
              return false;
            }
            else{
              nextSource[key] = source[key];
              return true;
            }
          });
          if(name && !$_type){
            keys.unshift('name');
            nextSource.name = name;
          }
          var Renderer = hasPrimitiveValues ? object : fields;
          return (
              <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {
                  $_type ? (
                    <div style={{ padding: 10, borderBottom: '1px solid #bbb' }}>
                        <div style={{ lineHeight: '40px' }}>{ app.extract($_type) } { app.extract(name) || null }</div>
                    </div>
                  ) : null
                }
                <Renderer { ...this.props } source={ nextSource }/>

              </div>
            );
        }
      };
    }
};
