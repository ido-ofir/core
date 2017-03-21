module.exports = {
  name: 'view',
  build(definition){
    var { name, bindings, dependencies, template, get } = definition;
    if(!dependencies) dependencies = [];
    if(!bindings) bindings = {};
    var app = this;
    var view = app.Component({
      name: name,
      dependencies: dependencies,
      get(...modules){

        var Component = app.createComponent(name, get.call(this, ...modules));
        // var render = get.call(this, ...modules)
        return {
          render(){

            return this.app.bind(bindings, (state)=>{

              var props = { ...this.props, ...state }
              return app.createElement({
                type: Component,
                props: props,
                children: props.children
              });
            });
          }
        };
      }
    }, (view)=>{
      this.views[name] = view;
      if(callback) callback(view);
    });
    return view;
  }
};
