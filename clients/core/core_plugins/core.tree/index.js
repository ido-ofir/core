

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
                return this.tree.set(path, value);
            },
            get(path) {
                return this.tree.get(path);
            },
            select(path) {
                return this.tree.select(path);
            }
        })
        done();
    },
    extend: {

    }
};