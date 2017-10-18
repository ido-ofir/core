
module.exports = {
    $_type: 'plugin',
    name: 'ui',
    components: [
        require('./Button.jsx'),
        require('./Icon.jsx'),
        require('./Card.jsx'),
        require('./Input.jsx'),
        require('./Select.jsx'),
        require('./ListItem.jsx')
    ],
    modules: {
        test: {a:5}
    },
    init(definition, done){
        
        var core = this;

        done({
            go(){ 
                alert('ui is ready to go'); 
            }
        });

    }
};