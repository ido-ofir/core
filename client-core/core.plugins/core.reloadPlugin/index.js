
module.exports = require('./core.reloadPlugin.js');

if(module.hot) {
    module.hot.accept('./core.reloadPlugin.js', function() {
        var plugin = require('./core.reloadPlugin.js');
        core.plugin(plugin);
    });
}