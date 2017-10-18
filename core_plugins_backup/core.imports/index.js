module.exports = {
    name: 'core.imports',
    extend: {
        imports: {},
        import (name, modul) {
            if (modul) {
                if (this.isString(modul)) {
                    var modules = {};
                    for (var i = 0; i < arguments.length; i++) {
                        name = arguments[i];
                        if (!this.imports[name]) {
                            throw new Error(`cannot find import '${ name }'`)
                        }
                        modules[name] = this.imports[name];
                    }
                    return modules;
                } else {
                    this.imports[name] = modul;
                }
            }
            if (!this.imports[name]) {
                throw new Error(`cannot find import '${ name }'`)
            }
            return this.imports[name];
        }
    }
};