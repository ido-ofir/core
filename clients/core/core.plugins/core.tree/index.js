

module.exports = {
    name: 'core.tree',
    dependencies: ['core.imports'],
    init(def, done) {
        var core = this;
        var Baobab = core.imports.baobab;
        core.extend({
            tree: new Baobab({
                plugins: {}
            }),
            set(path, value) {
                return this.tree.set.apply(this.tree, arguments);
            },
            get(path) {
                return this.tree.get.apply(this.tree, arguments);
            },
            select(path) {
                return this.tree.select.apply(this.tree, arguments);
            }
        })
        done();
    },
    extend: {

    }
};