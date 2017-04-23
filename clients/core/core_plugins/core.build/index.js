module.exports = {
    name: 'core.build',
    dependecies: [
        'core.types'
    ],
    extend: {
        build(source) {

            var core = this;
            var type, typeName, built;

            if (!source) {
                return source;
            }
            typeName = source['$_type'];
            if (!typeName) {
                if(core.isArray(source)){
                    return source.map(core.build);
                }
                if(core.isObject(source)){
                    return core.assign({}, source, function(property, key, source){
                        return core.build(property);
                    });
                }
                return source;
            }
            if(typeName === 'plugin'){
                // console.log(source.name);                
            }
            type = typeName ? this.types[typeName] : null;
            if (!type) throw new Error(`cannot find type '${typeName}'`);
            if (!type.build) throw new Error(`type '${typeName}' does not have a build method`);
            built = type.build.call(this, source);
            return built;
        }
    }
};