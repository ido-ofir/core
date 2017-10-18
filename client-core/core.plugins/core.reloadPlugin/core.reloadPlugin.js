module.exports = {
    name: 'core.reloadPlugin',
    extend: {
        reloadPlugin(pluginDef){
            core.injector.unlock();
            var pluginName = pluginDef.name;
            var names = {};
            function collectName(item){
                if(item && item.name){
                    names[`${ pluginName }.${ item.name }`] = true;
                }
            }
            function collectNames(array){
                if(!array) return;
                array.map(collectName);
            }
            var reloads = ['modules', 'components', 'views']            
            reloads.map(key => collectNames(pluginDef[key]));
            Object.keys(names).map(core.injector.revoke);
            core.plugin(pluginDef);
            core.injector.lock();
            core.emit('hotUpdate');
        }
    }
};