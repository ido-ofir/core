
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'renderers.fields',
    dependencies: [],
    get(){

      var app = this;

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
          var keys = Object.keys(source);

          return (
              <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {
                    keys.map((key, i) => {
                      var item = source[key];
                      var newPath = null;
                      if(path){
                        newPath = path.concat([key]);
                      }
                      return (
                        <div key={ key }
                            onClick={ e => this.setState({ selectedKey: key }) }
                            style={{ padding: 10, borderBottom: '1px solid #bbb' }}>
                              <div style={{ lineHeight: '40px' }}>{ key }</div>
                            <div>
                              {  
                                plugin.render({
                                  source: item,
                                  path: newPath, 
                                  onChange: this.onChildChange,
                                  map: map
                                })
                              }
                            </div>
                        </div>
                      );
                    })
                  }
              </div>
            );
        }
      };
    }
};
