
module.exports = {
    name: "<% name %>",
    dependencies: [],
    schema: [{
        key: 'name',
        type: 'string',
        value: 'unnamed'
    }],
    get() {
        
        var core = this;

        return ({ name }, promise) => {

        };
    }
}