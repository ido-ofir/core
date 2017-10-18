module.exports = {
    name: 'core.mapTypes',
    extend: {
        flatten(source, result) {
            var core = this;
            var isObject = core.isObject(source);
            var isArray = core.isArray(source);
            if (!isObject && !isArray) {
                return source;
            }
            if (!result) result = {};
            var type = source['$_type'];
            if (type) {
                if (!result[type]) {
                    result[type] = [];
                }
                result[type].push(source);
            }
            for (var m in source) {
                core.flatten(source[m], result);
            }
            return result;
        },
        mapTypes(source) {
            var core = this;
            if (!source) source = this.source || {};
            var types, coreTypes = core.Array();
            for (var m in core.types) {
                coreTypes.push(core.types[m]);
            }
            var flat = core.flatten(source);
            flat.type = (flat.type ? core.Array(coreTypes.concat(flat.type)) : coreTypes);
            return flat;
        },
        extract(source, path) {
            if (!this.isObject(source)) {
                // return source;
                // console.debug('source', source);

            }
            if (!path) path = [];
            if (!this.isArray(path)) {
                path = [path];
            }
            var key = path.length ? path.unshift() : null;
            var type = source['$_type'];
            if (type) {
                if (type === 'object') {
                    if (!key) return this.extract(source.members);
                    for (var i = 0; i < source.members.length; i++) {
                        if (source.members[i].key === key) {
                            return this.extract(source.members[i].value, path);
                        }
                    }
                } else if (type === 'array') {
                    if (!key && (key !== 0)) return this.extract(source.items);
                    return source.items[key];
                } else if ('value' in source) {
                    return source.value;
                }
            }
            return key ? source[key] : source;
        }
    }
};