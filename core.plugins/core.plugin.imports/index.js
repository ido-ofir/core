
module.exports = {
    name: 'core.plugin.imports',
    dependencies: ['core.plugin.hooks'],
    hooks: [{
        channel: 'core.pluginDefinition',
        hook(pluginDefinition, next){
            var importName, core = this;
            if(pluginDefinition.imports){
                if(core.isObject(pluginDefinition.imports)){
                    for(var name in pluginDefinition.imports){
                        importName = name;
                        if(importName.indexOf('imports.') !== 0){
                            importName = `imports.${ importName }`;
                        }
                        core.injector.add(importName, pluginDefinition.imports[name]);
                        core.imports[name] = pluginDefinition.imports[name];
                    }
                }
                else{
                    console.warn(`core.plugin.imports - cannot create imports from ${ pluginDefinition.imports }`)
                }
            }
            next();
        }
    }]
};