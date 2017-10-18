
var Core = require('./core.skeleton');
/**
 * @name clientCore
 */
var core = new Core({
    name: 'client-core',
    plugins: [
      require('./core.plugins/core.plugin.extend'),      
      require('./core.plugins/core.uuid'),      
      require('./core.plugins/core.eventEmitter'),
      require('./core.plugins/core.injector'),
      require('./core.plugins/core.plugin.injector'),
      require('./core.plugins/core.reloadPlugin'),
      require('./core.plugins/core.monitor'),
      require('./core.plugins/core.get-definition-object'),
      require('./core.plugins/core.plugin.channels'),
      require('./core.plugins/core.plugin.hooks'),
      require('./core.plugins/core.imports'),
      require('./core.plugins/core.plugin.imports'),
      require('./core.plugins/core.imports.react'),
      require('./core.plugins/core.imports.create-react-class'),
      require('./core.plugins/core.imports.prop-types'),
      require('./core.plugins/core.imports.baobab'),
      require('./core.plugins/core.imports.q'),
      require('./core.plugins/core.imports.react-dom'),
      require('./core.plugins/core.Array'),
      require('./core.plugins/core.types'),
      require('./core.plugins/core.build'),
      require('./core.plugins/core.plugin.types'),
      require('./core.plugins/core.prepend'),
      require('./core.plugins/core.modules'),
      require('./core.plugins/core.components'),
      require('./core.plugins/core.actions'),
      require('./core.plugins/core.tree'),
      require('./core.plugins/core.bindings'),
      require('./core.plugins/core.views'),
      require('./core.plugins/core.templates'),
      require('./core.plugins/core.bequeath'),
      require('./core.plugins/core.mapTypes'),
      require('./core.plugins/core.apps'),
      require('./core.plugins/core.plugins'),
      require('./core.plugins/core.plugin.modules'),
      require('./core.plugins/core.plugin.actions'),
      require('./core.plugins/core.plugin.tree'),
      require('./core.plugins/core.plugin.bind'),      
      require('./core.plugins/core.plugin.components'),
      require('./core.plugins/core.plugin.views'),
      require('./core.plugins/core.dox'),
      require('./core.plugins/core.list'),      
    ]
});

if(typeof window !== 'undefined'){ window.core = core; }

module.exports = core;
