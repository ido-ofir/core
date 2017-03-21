
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'renderers.object',
    dependencies: [],
    get(){
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
          console.log('type', type);
          if(source.ofType){
            var type = app.types[source.ofType];
            if(type){
              console.log('type', type);
              
            }
          }
        },
        editChild(){},
        removeChild(){},
        onChildChange(path, value){
          var isTypedObject = (this.props.source['$_type'] === 'object');
          if(isTypedObject){
            path = [ ...path ];
            path.splice(1, 0, 'members');
          }
          if(this.props.onChange){
            this.props.onChange(path, value);
          }
        },
        renderAddButton(){
          return (
            <div style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #bbb' }} onClick={ this.addChild }> { '{ + }'} </div>
          );
        },
        render(){
          // console.debug('this', source);
          
          
          var { source, path, map } = this.props;
          
          if(!source) return null;
          
          var isTypedObject = (source['$_type'] === 'object');
          
          var app = this.app;
          var plugin = app.plugins.renderers;
          var { selectedKey } = this.state;
          var item, child;
          
          if(!isTypedObject){
            
            item = source[selectedKey];
            // child = plugin.render(item);   
            
            var keys = Object.keys(source);
            if(!keys.length){
              return this.renderAddButton();
            }
            var nextPath = null;;
            if(item && path){
              nextPath = path.concat([selectedKey]);
            }
            return (
              <div style={{ flex: 1, height: '100%', display: 'flex'}}>
                <div style={{ flex: 1, maxWidth: 140, minWidth: 140, borderRight: '1px solid #bbb', overflow: 'auto' }}>
                  {
                    keys.map((key, i) => {
                      var item = source[key];                      
                      return (
                        <div key={ key }
                            onClick={ e => this.setState({ selectedKey: key }) }
                            style={{ padding: 10, cursor: 'pointer', background: (selectedKey === key) ? '#ddd' : '#fff', borderBottom: '1px solid #bbb' }}>
                            { key }
                        </div>
                      );
                    })
                  }
                { this.renderAddButton() }
                </div>
                <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'auto' }}>
                  {
                    item ?
                      plugin.render({
                        source: item,
                        path: nextPath, 
                        onChange: this.onChildChange,
                        map: map
                      })
                    :
                    null
                  }
                </div>
              </div>
            );
          }
          else{
            var members = source.members;
            if(!members) return null;
            item = members[selectedKey];
            return null;
          }
        }
      };
    }
};
