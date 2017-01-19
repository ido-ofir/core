
var React = require('react');
var Baobab = require('baobab');



module.exports = function (core) {

  // var structure = core.Array([{
  //   name: 'plugins',
  //   builder: 'Plugin'
  // },{
  //   name: 'modules',
  //   builder: 'Module'
  // },{
  //   name: 'components',
  //   builder: 'Component'
  // },{
  //   name: 'views',
  //   builder: 'View'
  // },{
  //   name: 'templates',
  //   builder: 'Template'
  // },{
  //   name: 'actions',
  //   builder: 'Action'
  // }]);

  function update(path, source) {

    var app = this;

    if(arguments.length === 1){
      source = path;
      path = [];
    }

    var lastSource = this.source || {};

    if(!path.length){

      app.name = source.name;
      if(source.tree){
        if(source.tree !== lastSource.tree){
          var built = app.build(source.tree);
          if(app.tree) app.tree.set(built);
          else{
            app.tree = new Baobab(built);
          }
        }
      }
      // structure.map((branch) => {  // inherit all fields in structure from core.
      //   var name = branch.name;
      //   if(!app[name]) app[name] = Object.create(core[name]);
      // });
      if(!app.plugins) app.plugins = Object.create(core.plugins);
      if(!app.modules) app.modules = Object.create(core.modules);
      if(!app.components) app.components = Object.create(core.components);
      if(!app.views) app.views = Object.create(core.views);
      if(!app.templates) app.templates = Object.create(core.templates);
      if(!app.actions) app.actions = Object.create(core.actions);
      if(!app.builders) app.builders = Object.create(core.buildres);



      for(var m in source){ // bind all functions to app.
        if(core.isFunction(source[m])){
          app[m] = source[m].bind(app);
        }
      }

      if(source.modules){
        source.modules.map(m => {
          app.Module(m);
        });
      }
      if(source.components){
        source.components.map((c) => {
          app.Component(c);
        });
      }
      if(source.views){
        source.views.map((v) => {
          app.View(v);
        });
      }
      if(source.templates){
        source.templates.map((t) => {
          app.Template(t);
        });
      }
      if(source.actions){
        source.actions.map((action) => {
          app.Action(action)
        });
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

  function App(source) {

    var app = this;
    app.core = core;
    app.update = update.bind(app);
    app.update(source);
    app.emit('load');

  }

  App.prototype = core;

  // App.structure = structure;

  return App;

}
