module.exports = {
    name: '<% name %>',
    init(definition, done){
        
        var core = this;

        done({
            go(){ 
                alert('<% name %> is ready to go'); 
            }
        });
    }
};