var React = require('react');
var core = window.core = require('core');
var components = require('./components/components.js');
var modules = require('./modules/modules.js');
var tree = require('./tree/tree.js');
var actions = require('./actions/actions.js');
var views = require('./views/views.js');
var plugins = require('./plugins/plugins.js');

var editedApp = require('./editedApp');
var app = window.xApp = core.build({
  $_type: 'app',
  name: 'coreEditor',
  tree: tree,
  components: components,
  modules: modules,
  actions: actions,
  views: views,
  templates: [],
  plugins: plugins,
  types: [{
    $_type: 'type',
    name: 'kokoloko'
  }],
  root: {
    name: 'CoreEditorRoot',
    dependencies: [
      'EditItems'
    ],
    bindings: {
      'source': 'source'
    },
    get(EditItems){

      var app = this;

      return {

        getInitialState(){



          return {
            type: 'actions',
            selectedIndex: 0
          };
        },

        onSave({ code, item, type }){
          app.run('save', { code, item, type });
        },

        onChange(path, source){
          console.debug('change', path, source);
          app.run('setSource', { path: path, source: source })
        },

        render() {

          
          var { source } = this.props;
          if(!source) return null;
          // console.debug('source', source);
          
          var { renderers, popup } = app.plugins;
          var map = core.mapTypes(source);
          var res = renderers.render({
            source: source,
            path: [],
            onChange: this.onChange,
            map: map
          });

          console.debug('res', res, map);
          

          return (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom:0,  display: 'flex' }}>
              OK
              { res }
              {/*{ popup.render() }*/}
            </div>
          );

        }
      }
    }
  },
});

app.editedApp = window.editedApp = editedApp;
app.set('source', editedApp.source);

module.exports = app;
