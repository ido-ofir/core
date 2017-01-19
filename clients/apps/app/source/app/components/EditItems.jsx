
var React = require('react');

module.exports = {
    name: 'EditItems',
    dependencies: ['Editor'],
    get(Editor, compile){
      return {
        propTypes: {
          type: 'string',
          items: 'array',
          onSave: 'func',
        },
        getInitialState(){
          return {
            selectedIndex: 1
          };
        },
        onSave(code){
          var { items, onSave, type } = this.props;
          if(onSave){
            var item = items[this.state.selectedIndex];
            onSave({ code, item, type });
          }
        },
        render(){
          var { items } = this.props;
          if(!items) return null;
          var { selectedIndex } = this.state;
          var item = items[selectedIndex];

          return (
            <div style={{ height: '100%', display: 'flex'}}>
              <div style={{ flex: 1, maxWidth: 120, minWidth: 120 }}>
                {
                  items.map((item, i) =>
                    <div key={ i }
                         onClick={ e => this.setState({ selectedIndex: i }) }
                         style={{ padding: 10, cursor: 'pointer', background: (selectedIndex === i) ? '#ddd' : '#fff', borderBottom: '1px solid #bbb' }}>
                      { item.name }
                    </div>
                  )
                }
              </div>
              {
                item ?
                <Editor code={ item.source || '' } onSave={ this.onSave } style={{ height: '100%' }}/>
                :
                null
              }

              {
                /*
                <Editor code={ action.compiled || '' } style={{ height: 200 }}/>*/
              }

            </div>
          );
        }
      };
    }
};
