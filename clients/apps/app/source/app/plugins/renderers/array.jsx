
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'renderers.array',
    dependencies: ['renderers.addItemPopup'],
    get(){

      var app = this;

      return {
        propTypes: {
          map: 'object',
          source: 'object',
          onChange: 'func',
          path: 'any'
        },
        getInitialState(){
          return {
            selectedIndex: 0
          };
        },
        // onChildChange(child, index){
        //   var { source, onChange, id } = this.props;
        //   var newTarget = { ...source };
        //   if(newTarget.items[index] === child) return;
        //   newTarget.items = [ ...newTarget.items ];
        //   newTarget.items[index] = child;
        //   if(onChange) { onChange(newTarget, id); }
        // },
        addChild(){
          var { map, source } = this.props;

          if(source.ofType){
            var type = map.type.find({ name: source.ofType });
            if(type){
              var Popup = app.components['renderers.addItemPopup'];
              app.plugins.popup.open(
                <Popup type={ type } onDone={ d => app.plugins.popup.close() } map={ this.props.map }/>
              );
              console.debug('type', type);
              
            }
          }
        },
        editChild(){},
        removeChild(){},
        onChildChange(path, value){
          var isTypedArray = (this.props.source['$_type'] === 'array');
          if(isTypedArray){
            path = [ ...path ];
            path.splice(1, 0, 'items');
          }
          if(this.props.onChange){
            this.props.onChange(path, value);
          }
        },
        renderAddButton(){
          return (
            <div style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #bbb' }} onClick={ this.addChild }> { '[ + ]'} </div>
          );
        },
        render(){
          var { source, path, map } = this.props;
          if(!source) {
            return null;
          }
          var isTypedArray = (source['$_type'] === 'array');
          var items = isTypedArray ? source.items : source;
          if(!items || !items.length) {
            return this.renderAddButton();
          }
          var { selectedIndex } = this.state;
          var item = items[selectedIndex];
          var app = this.app;
          var plugin = app.plugins.renderers;

          var nextPath = null;;
          if(item && path){
            nextPath = path.concat([selectedIndex]);
          }
          

          return (
            <div style={{ height: '100%', flex: 1, display: 'flex'}}>
              <div style={{ flex: 1, maxWidth: 140, minWidth: 140, borderRight: '1px solid #bbb' }}>
                {
                  items.map((item, i) =>
                    <div key={ i }
                         onClick={ e => this.setState({ selectedIndex: i }) }
                         style={{ padding: 10, cursor: 'pointer', background: (selectedIndex === i) ? '#ddd' : '#fff', borderBottom: '1px solid #bbb' }}>
                      { 'ok' }
                    </div>
                  )
                }
              </div>
              <div style={{ flex: 1 }}>
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
                { this.renderAddButton() }
              </div>

            </div>
          );
        }
      };
    }
};
