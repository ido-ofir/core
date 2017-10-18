
var React = require('react');

module.exports = {
    name: 'Actions',
    dependencies: ['Editor', 'compile'],
    bindings: {
      actions: ['source', 'actions']
    },
    get(Editor, compile){
      return {
        getInitialState(){
          return {
            selectedIndex: 1
          };
        },
        saveAction(code){
          var { action } = this.state;
          var action = this.props.actions[this.state.selectedIndex];
          action = { ...action, $_type: { name: 'code', source: code, compiled: compile.asReturnFunction(code) } };
          this.app.run('setSource', { path: ['actions', { name: action.name } ], source: action });
          this.app.Action(action);
          // this.setState({})
        },
        render(){
          var { actions } = this.props;
          var { selectedIndex } = this.state;
          var action = this.props.actions[selectedIndex];
          console.log('render actions', action);
          var type = action['$_type'] || {};

          return (
            <div style={{ height: 600, display: 'flex'}}>
              <div>
                {
                  actions.map((act, i) =>
                    <div key={ i }
                         onClick={ e => this.setState({ selectedIndex: i }) }
                         style={{ padding: 10, cursor: 'pointer', background: (selectedIndex === i) ? '#ddd' : '#fff' }}>
                      { act.name }
                    </div>
                  )
                }
              </div>
              <Editor code={ action.source || '' } onSave={ this.saveAction } style={{ height: 300 }}/>
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
