module.exports = {
    name: 'core.apps',
    dependencies: [
        'core.getDefinitionObject',
        'core.build'
    ],
    extend: {
        apps: {},
        App(name, dependencies, get) {
            var definition = this.getDefinitionObject(name, dependencies, get, 'app');
            return this.build(definition);
        }
    },
    types: [{
        name: 'app',
        recursive: false,
        schema: {
            name: {
                type: 'string',
                required: true
            }
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
                inherit: ['types', 'modules', 'components', 'views', 'templates', 'actions', 'plugins']
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
    }]
};

function update(path, source) {

    var app = this;
    var Baobab = app.imports.baobab;
    var React = app.imports.react;

    if (arguments.length === 1) {
        source = path;
        path = [];
    }
    // console.log('app update', path, source);



    if (!path.length) {
        var lastSource = app.source || {};
        var plugin, tree, build = {};
        
        for (var m in source) {
            build[m] = app.build(source[m]);
        }
        if (!build) return; // console.log('no change', path);
        app.name = build.name;
        if (build.tree) {
            if (source.tree !== lastSource.tree) {
                tree = Object.assign({}, build.tree);
                if (app.tree && app.tree instanceof Baobab) {
                    app.tree.update(tree);
                } else {
                    app.tree = new Baobab(tree);
                }
            } else {
                // console.log('no change in tree', path);
            }
        }

        if (source.root) {

            if(!core.isString(source.root)){
                app.View(source.root)
            }

            var { createReactClass, React, PropTypes } = app.imports;

            app.Root = createReactClass({
                childContextTypes: {
                    app: PropTypes.object
                },
                getChildContext() {
                    return {
                        app: app
                    };
                },
                getInitialState(){
                    this.Root = (
                        core.isString(source.root) ?
                        app.components[source.root] :
                        app.views[source.root.name]
                    )
                    return null;
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
                    var props = Object.assign({
                        app: app
                    }, this.props);
                    return React.createElement(this.Root, props, this.props.children);
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