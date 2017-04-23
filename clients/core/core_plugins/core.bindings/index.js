module.exports = {
    name: 'core.bindings',
    dependencies: [
        'imports.react',
        'imports.prop-types',
        'imports.create-react-class'
    ],
    init(definition, done) {

        var core = this;
        var { createReactClass, PropTypes, React } = core.imports;

        var Bindings = createReactClass({
            propTypes: {
                bindings: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
                render: PropTypes.func,
                tree: PropTypes.object.isRequired
            },
            getInitialState() {
                var bindings = this.props.bindings;
                if (!bindings) return null;
                if (typeof bindings === 'string') {
                    bindings = [bindings];
                }
                return this.watch(bindings);
            },
            watch(bindings) {
                if (Array.isArray(bindings)) {
                    this.isSingle = true;
                    bindings = {
                        item: bindings
                    }
                }
                if (this.watcher) {
                    this.watcher.off('update', this.updateBindings);
                }
                var watcher = this.watcher = this.props.tree.watch(bindings);
                watcher.on('update', this.updateBindings);
                return watcher.get();
            },
            updateBindings() {
                if (this.watcher) {
                    this.setState(this.watcher.get());
                }
            },
            componentWillUnmount() {
                this.watcher.off('update', this.updateBindings);
            },
            render() {
                var data = this.isSingle ? this.state.item : this.state;
                var render = this.props.render || this.props.children;
                var rendered = render(data);
                return rendered || null;
            }
        });

        core.extend({
            bind(bindings, render) {
                var props = {
                    bindings: bindings,
                    render: render,
                    tree: this.tree
                };
                return React.createElement(Bindings, props);
            },
            Bindings: Bindings,
        });

        done('√');
    }

};