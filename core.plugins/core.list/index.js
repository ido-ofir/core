
function List(name, plugin){
    this.name = name;
    this.items = {};
    this.plugin = plugin;
}



List.prototype = {
    open(name){
        var list = this.plugin.get(this.name);
        if(!list) throw new Error(`cannot find list ${ this.name }`);
        var openedIds = list.openedIds || [];
        var newOpenedIds = openedIds.filter(id => id !== name);
        newOpenedIds.push(name);
        this.plugin.set([this.name, 'openedIds'], newOpenedIds);
    },
    close(name){
        var list = this.plugin.get(this.name);
        if(!list) throw new Error(`cannot find list ${ this.name }`);
        var openedIds = list.openedIds || [];
        var newOpenedIds = openedIds.filter(id => id !== name);
        this.plugin.set([this.name, 'openedIds'], newOpenedIds);
    },
    clear(){
        var list = this.plugin.get(this.name);
        if(!list) throw new Error(`cannot find list ${ this.name }`);
        this.plugin.set([this.name, 'openedIds'], []);
    },
    isOpen(name){
        var list = this.plugin.get(this.name);
        if(!list) throw new Error(`cannot find list ${ this.name }`);
        var openedIds = list.openedIds || [];
        return (openedIds.indexOf(name) > -1);
    },
    isClosed(){
        var list = this.plugin.get(this.name);
        if(!list) throw new Error(`cannot find list ${ this.name }`);
        var openedIds = list.openedIds || [];
        return (openedIds.indexOf(name) === -1);
    }
}

module.exports = {
    name: 'core.list',
    tree: {},
    instances: {},
    extend: {
        list(name, body){
            var list = this.plugins['core.list'];
            var instance = list.instances[name];
            if(!instance) {
                instance = new List(name, list);
                list.instances[name] = instance;
            }
            if(body){
                list.set(name, body);
            }
            if(!list.get(name)){
                list.set([name], {
                    openedIds: []
                });
            }
            return instance;
        }
    }
}