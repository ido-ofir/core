
var React = require('react');
var Baobab = require('baobab');



module.exports = function (core) {

  function update(path, source) {
    var app = this;

    if(arguments.length === 1){
      source = path;
      path = [];
    }
    // console.log('app update', path, source);

    

    if(!path.length){

      var lastSource = app.source || {};
      var build = app.build(source, path);
      if(!build) return console.log('no change', path);
      app.name = build.name;
      if(build.tree){
        if(source.tree !== lastSource.tree){
          if(app.tree) {
            console.log('updating', path);
          }
          else{
            app.tree = new Baobab(build.tree);
          }
        }
        else{
          console.log('no change in tree', path);
        }
      }

      for(var m in source){ // bind all functions to app.
        if(core.isFunction(source[m])){
          app[m] = source[m].bind(app);
        }
      }

      if(source.root){
        var Root = (
          core.isString(source.root) ?
            app.components[source.root] :
            app.View(source.root)
        );

        app.Root = React.createClass({
          childContextTypes: {
            app: React.PropTypes.object
          },
          getChildContext(){
            return {
              app: app
            };
          },
          componentDidMount(){
            app.on('update', this.update);
          },
          componentWillUnmount(){
            app.off('update', this.update);
          },
          update(){
            this.forceUpdate();
          },
          render(){
            return <Root app={ app } { ...this.props }>{ this.props.children }</Root>
          }
        });
      }

      app.source = source;
      app.emit('update', { path, source });
    }

    else{
      var type = path[0];
      var builder = this.builders[type];
      if(!builder) {
        var single = type.substr(0, type.length - 1);
        builder = this.builders[single];
        if(!builder) {
          throw new Error(`cannot find builder '${type}' or '${single}'`);
        }
      }
      builder.call(this, source);
      app.emit('update', { path, source });
    }
  }

  function App(source, parent) {

    if(!parent) parent = core;
    var app = this;
    app.name = this.build(source.name);
    app.plugins = Object.create(parent.plugins);
    app.modules = Object.create(parent.modules);
    app.components = Object.create(parent.components);
    app.views = Object.create(parent.views);
    app.templates = Object.create(parent.templates);
    app.actions = Object.create(parent.actions);
    app.types = Object.create(parent.types);
    app.core = core;
    app.parent = parent;
    app.update = update.bind(app);
    if(app.plugins){
      for(var p in app.plugins){
        if(app.plugins[p].init){
          app.plugins[p].init();
        }
      }
    }
    app.update(source);
    app.emit('load');

  }

  App.prototype = core;

  return App;

}
