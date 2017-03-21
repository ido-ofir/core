
var React = require('react');
var Baobab = require('baobab');



module.exports = {
  name: 'app',
  recursive: false,
  schema: {
    name: {
      $_type: 'string',
      value: ''
    }
  },
  init(){
    this.App = function App(){}
  },
  build(def) {

    var apps = this.apps || {};
    var name = def.name;
    if (!name) {
      throw new Error('an app must have a name');
    }
    if (apps[name]) {
      apps[name].update(def);
      return apps[name];
    }
    var app = this.bequeath(def, {
      inherit: ['types', 'modules', 'components', 'views', 'templates', 'actions', 'plugins'],
      constructor: this.App
    });
    app.update = update.bind(app);


    apps[name] = app;
    if (app.init) {
      app.init(app);
    }

    app.update(def);
    app.emit('load');
    
    return app;
  }
};




function update(path, source) {
  
  var app = this;

  if (arguments.length === 1) {
    source = path;
    path = [];
  }
  // console.log('app update', path, source);



  if (!path.length) {
    var lastSource = app.source || {};
    var plugin, tree, build = {};
    for(var m in source){
      build[m] = app.build(source[m]);
    }
    if (!build) return console.log('no change', path);
    app.name = build.name;
    if (build.tree) {
      if (source.tree !== lastSource.tree) {
        tree = { ...build.tree }
        if(build.plugins){
          tree.plugins = {};
          for(var index in build.plugins){
            plugin = build.plugins[index];
            if(plugin && plugin.state){
              tree.plugins[plugin.name] = plugin.state;
            }
          }
        }
        if (app.tree && app.tree instanceof Baobab) {
          app.tree.update(tree);
        } 
        else {
          app.tree = new Baobab(tree);
        }
      } 
      else {
        // console.log('no change in tree', path);
      }
    }

    if (source.root) {
      
      var Root = (
        core.isString(source.root) ?
        app.components[source.root] :
        app.View(source.root)
      );

      

      app.Root = React.createClass({
        childContextTypes: {
          app: React.PropTypes.object
        },
        getChildContext() {
          return {
            app: app
          };
        },
        componentDidMount() {
          app.on('update', this.update);
        },
        componentWillUnmount() {
          app.off('update', this.update);
        },
        update() {
          this.forceUpdate();
        },
        render() {
          return ( 
            <Root app={ app } { ...this.props }>
              { this.props.children }
            </Root>
          );
        }
      });
    }

    app.source = source;
  } 
  app.emit('update', {
    path,
    source
  });
}