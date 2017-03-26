
module.exports = {
    name: 'core.modules',
    extend: {
        Module(name, dependencies, get){
            var definition = this.getDefinitionObject(name, dependencies, get, 'module');    
            return this.build(definition);
        },
    }
};