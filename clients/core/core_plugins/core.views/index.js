module.exports = {
    name: 'core.views',
    dependencies: [
        'core.getDefinitionObject',
        'core.build',
        'core.components'
    ],
    extend: {
        views: {},
        View(name, dependencies, get, done) {
            var definition = this.getDefinitionObject(name, dependencies, get, 'view', done);
            return this.build(definition);
        },
    },
        types: [{
        name: 'view',
        build(definition) {

            var core = this;
            var {
                name,
                bindings,
                dependencies,
                template,
                get,
                done
            } = definition;
            if (!dependencies) dependencies = [];
            if (!bindings) bindings = {};
            return core.Component({
                name: name,
                dependencies: dependencies,
                get(modules) {
                    modules = [].slice.call(arguments);
                    var Component = core.createComponent(name, get.apply(this, modules));
                    return {
                        render() {

                            return core.bind(bindings, (state) => {

                                var props = core.assign({}, this.props, state);
                                return core.createElement({
                                    type: Component,
                                    props: props,
                                    children: props.children
                                });
                            });
                        }
                    };
                },
                done(view){
                    core.views[name] = view;
                    if (done) done(view);
                }
            });
        }
    }]
};