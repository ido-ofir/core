
var React = require('react');

module.exports = {
    $_type: 'plugin',
    name: 'renderers',
    recursive: false,
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
    bind(){
        
    },

    alert(){
        console.debug('this.components.length', this.components.length);
    },
    render({source, path, onChange, map}){      
        var typeName = this.$_typeOf(source);
        var Renderer;
        if(!typeName){
            console.warn(`renderers plugin cannot find type ${typeName}`)
            Renderer = this.app.components[`renderers.json`];
        }
        else{
          Renderer = this.app.components[`renderers.${typeName}`];
          if(!Renderer) {
            Renderer = this.app.components[`renderers.typedObject`];
          }
        }
        
        return <Renderer source={ source } path={ path } onChange={ onChange } map={ map }/>;
    }
}