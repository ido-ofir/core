module.exports = {
    name: 'core.build',
    dependecies: [
        'core.types'
    ],
    extend: {
        build(source) {

            var type, typeName, built;

            if (!source) {
                return source;
            }
            typeName = source['$_type'];
            if (!typeName) {
                return source;
            }
            type = typeName ? this.types[typeName] : null;
            if (!type) throw new Error(`cannot find type '${typeName}'`);
            if (!type.build) throw new Error(`type '${typeName}' does not have a build method`);
            built = type.build.call(this, source);
            return built;
        }
    }
};