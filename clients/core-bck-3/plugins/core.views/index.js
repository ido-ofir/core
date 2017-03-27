module.exports = {
    name: 'core.views',
    dependencies: [
        'core.getDefinitionObject',
        'core.build'
    ],
    extend: {
        views: {},
        View(definition, callback) {
            var definition = this.getDefinitionObject(name, dependencies, get, 'view');
            return this.build(definition);
        },
    },
        types: [{
        name: 'view',
        build(definition) {
            var {
                name,
                bindings,
                dependencies,
                template,
                get
            } = definition;
            if (!dependencies) dependencies = [];
            if (!bindings) bindings = {};
            var app = this;
            var view = app.Component({
                name: name,
                dependencies: dependencies,
                get(modules) {
                    modules = [].slice.call(arguments);
                    var Component = app.createComponent(name, get.apply(this, modules));
                    return {
                        render() {

                            return this.app.bind(bindings, (state) => {

                                var props = Object.assign({}, this.props, state);
                                return app.createElement({
                                    type: Component,
                                    props: props,
                                    children: props.children
                                });
                            });
                        }
                    };
                }
            }, (view) => {
                this.views[name] = view;
                if (callback) callback(view);
            });
            return view;
        }
    }]
};