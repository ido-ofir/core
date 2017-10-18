function getPropTypes(propTypes, PropTypes) {
    if (!propTypes) return;
    var key, item, PropType, index, required;
    var pt = {};
    for (key in propTypes) {
        item = propTypes[key];
        if (typeof item === 'function') {
            pt[key] = item;
            continue;
        }
        if (item instanceof Object && !(Array.isArray(item))) {
            PropType = PropTypes[item.type];
            if (!PropType) throw new Error(`cannot find PropType ${key}`);
            if (item.required) {
                pt[key] = PropType.isRequired;
            } else {
                pt[key] = PropType;
            }
        }
    }
    return pt;
}


module.exports = {
    name: 'core.components',
    dependencies: [
        'core.getDefinitionObject',
        'core.build',
        'imports.React',
        'imports.createReactClass',
    ],
    types: [{
        name: 'component',
        extends: 'module',
        build(definition, _super, done) {
            // console.debug('definition', definition);

            var core = this;
            var { name, dependencies, get, value } = definition; 

            _super({
                name: name,
                dependencies: dependencies,
                get(...modules){
                    var def = get ? get.apply(this, modules) : value;
                    var component = core.createComponent(name, def);
                    core.components[name] = component;
                    return component;
                }
            }, done);
            // var {
            //     name,
            //     dependencies,
            //     get,
            //     value,
            //     done
            // } = definition;
            // var hasValue = ('value' in definition);
            // var componentDefinition;
            // if (hasValue) {
            //     componentDefinition = value;
            //     dependencies = [];
            // }
            // if (!dependencies) dependencies = [];
            // if (!core.isArray(dependencies)) dependencies = [dependencies];
            
            // var component = core.injector.load(name, dependencies, function () {

            //     var modules = [].slice.call(arguments);
            //     if (!hasValue) {
            //         componentDefinition = get.apply(core, modules);
            //     }

            //     var component = core.createComponent(name, componentDefinition);
            //     core.components[name] = component;
            //     // console.debug('component', name, component);
            //     done && done(component);
            //     return component;
            // });
            // return component;
        }
    }],
    extend: {
        components: {},
        Component(name, dependencies, get, done) {
            var definition = this.getDefinitionObject(name, dependencies, get, 'component', done);
            return this.build(definition, definition.done);
        },
        createElement(definition) {
            var {
                type,
                props,
                children
            } = definition;

            var {
                React
            } = this.imports;
            var component = this.isString(type) ? this.components[type] : type;
            if (children) {
                children = children.map(child => this.createElement(child));
                children.unshift(props);
                children.unshift(component);
                return React.createElement.apply(React, children);
            }
            return React.createElement(component, props);
        },
        createComponent(name, componentDefinition) {

            var core = this;
            var { createReactClass, React } = core.imports;
            var component;
            if (core.isFunction(componentDefinition)) { // stateless component function
                component = componentDefinition;
            } else {
                componentDefinition = Object.assign({
                    app: core
                }, componentDefinition);
                componentDefinition.propTypes = getPropTypes(componentDefinition.propTypes, this.PropTypes);
                componentDefinition.childContextTypes = getPropTypes(componentDefinition.childContextTypes, this.PropTypes);
                component = createReactClass(componentDefinition);
                component.displayName = name;
                if (componentDefinition.enhancers) { // enhancers is an array of higher order constructors.
                    componentDefinition.enhancers.map((higherOrder) => {
                        component = higherOrder(component);
                    });
                }
            }
            return component;
        },
    }
};