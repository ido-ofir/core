module.exports = {
    $_type: 'plugin',
    name: 'widgets',
    components: [
        require('./Widget.jsx')
    ],
    tree: [{
        id: 'a',
        a: 'b'
    }],
    extend: {
        widget(id){
            return this.plugins.widgets.select({ id: id });
        }
    }
};