
var React = require('react');

module.exports = {
    $_type: 'plugin',
    name: 'renderers',
    components: [
        require('./array.jsx'),
        require('./object.jsx'),
        require('./string.jsx'),
        require('./number.jsx'),
        require('./json.jsx'),
        require('./function.jsx'),
        require('./fields.jsx'),
        require('./action.jsx'),
        require('./$_type.jsx'),
        require('./app.jsx'),
        require('./typedObject.jsx'),
        require('./addItemPopup.jsx'),
    ],
    init(def, done){
        var core = this;

        done({
            render({source, path, onChange, map}){
                console.debug('source', source);
                if(!source || !core.isObject(source)) return null;
                var typeName = source['$_type'];
                var Renderer;
                if(!typeName){
                    console.warn(`renderers plugin cannot find type ${typeName}`)
                    Renderer = core.components[`renderers.json`];
                }
                else{
                Renderer = core.components[`renderers.${typeName}`];
                if(!Renderer) {
                    Renderer = core.components[`renderers.typedObject`];
                }
                }
                
                return <Renderer source={ source } path={ path } onChange={ onChange } map={ map }/>;
            }
        });
    }
    
}