
var loadDox = (function(){
    var dox, map;

    function parse(block){
        var type, body = {};
        for(var i = 0; i < block.tags.length; i++){
            // console.log(block.tags[i].type);
            type = block.tags[i].type;
            if(body[type]){
                if(!Array.isArray(body[type])){
                    body[type] = [body[type]];
                }
                body[type].push(block.tags[i]);
            }
            else{
                body[type] = block.tags[i];
            }
        }
        block.body = body;
        return block;
    }

    return function loadDox(cb){
        if(dox) { return cb(dox, map); }  
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function () {
            dox = JSON.parse(this.responseText);
            map = {
                components: {},
                modules: {},
                plugins: {}
            };
            dox.map(function(block){
                if(!block || !block.tags || !block.tags.length){ return; }
                block = parse(block);
                var body = block.body;
                if(body.component){
                    map.components[body.component.string] = block;
                }
                else if(body.module){
                    map.modules[body.module.string] = block;
                }
                else if(body.plugin){
                    map.plugins[body.plugin.string] = block;
                }
            });
            cb(dox, map);
        });
        oReq.open("GET", "dox.json");
        oReq.send();
}
}());

module.exports = {
    name: 'core.dox',
    init(definition, done){
        
        var core = this;

        done({
            go(){ 
                alert('core.dox is ready to go'); 
            }
        });

    }
};