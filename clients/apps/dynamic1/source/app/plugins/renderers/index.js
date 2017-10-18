
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
                var isObject = core.isObject(source);
                if(!source || !isObject) return null;
                var renderers = this;
                var typeName = source['$_type'];
                var Renderer;
                if(!typeName){
                    if(!isObject){
                        return console.warn(`renderers plugin cannot find renderer for type ${core.typeOf(source)}`, source)
                    }
                    Renderer = renderers.components[`json`];
                }
                else{
                    
                    Renderer = renderers.components[typeName];
                    if(!Renderer) {
                        Renderer = renderers.components[`typedObject`];
                    }
                }
                
                return <Renderer source={ source } path={ path } onChange={ onChange } map={ map }/>;
            }
        });
    }
    
}