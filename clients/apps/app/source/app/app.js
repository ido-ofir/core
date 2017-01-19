var React = require('react');
var core = require('core');
var components = require('./components/components.js');
var modules = require('./modules/modules.js');
var tree = require('./tree/tree.js');
var actions = require('./actions/actions.js');
var views = require('./views/views.js');

var editedApp = require('./editedApp');

var app = window.app = core.App({
  name: 'coreEditor',
  tree: tree,
  components: components,
  modules: modules,
  actions: actions,
  views: views,
  templates: [],
  types: [{
    'name': 'myNumber',
    'schema': {}
  }],
  init(app){

    app.editedApp = window.editedApp = editedApp;

    app.run('setSource', { source: this.editedApp.source, path: [] });

  },
  root: {
    name: 'CoreEditor',
    dependencies: [
      'EditItems'
    ],
    bindings: {
      'source': 'source'
    },
    get(EditItems){

      return {

        getInitialState(){



          return {
            type: 'actions',
            selectedIndex: 0
          };
        },

        onSave({ code, item, type }){
          this.app.run('save', { code, item, type });
        },

        render() {

          var { source } = this.props;
          var { selectedIndex } = this.state;
          if(!source) return null;
          var structure = this.app.get('structure');
          var type = structure[selectedIndex].name;
          console.log(this.props);
          return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, maxHeight: 40, borderBottom: '1px solid #ddd', alignItems: 'center', padding: 10 }}>
                  <div>{ app.editedApp && app.editedApp.name }</div>
                </div>
                <div style={{ flex: 1, display: 'flex' }}>
                  <div style={{ borderRight: '1px solid #bbb', minWidth: 120 }}>
                    {
                      structure.map((item, i) =>
                        <div key={ i }
                             onClick={ e => this.setState({ selectedIndex: i }) }
                             style={{ padding: 10, cursor: 'pointer', background: (selectedIndex === i) ? '#ddd' : '#fff' }}>
                          { item.name }
                        </div>
                      )
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <EditItems items={ source[type] } onSave={ this.onSave } type={ this.state.type }/>
                  </div>
                  <div style={{ flex: 1 }}>

                  </div>
                </div>

            </div>
          );

        }
      }
    }
  },
});



module.exports = app;
